import Company from '../models/company'
import uuid from 'uuid/v1'
import AWS from 'aws-sdk'
import { loadTemplate, sendEmail } from "../config/mailer";
import Invite from '../models/invites'
import { checkIsObjectHasOnlyAllowProperties, checkIsObjectHasRequiredProperties } from '../services/propertiesHelper'


const s3bucket = new AWS.S3({
    accessKeyId: 'AKIAJRX2IPJP7MB7ER7A',
    secretAccessKey: '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',
    Bucket: "cf-simple-s3-origin-calclogistic-556777295593"
});

export function createCompany(req, res) {
    const requireKeys = [
        "nameOfCompany",
        "name",
        "surname",
        "phone",
        "taxNumber",
        "place",
        "isVat",
        "email",
        "country",
        "countries",
        "password"
    ];

    const checkRequire = checkIsObjectHasRequiredProperties(requireKeys, req.body)

    if (!checkRequire) {
        return res.status(400).send({
            msg: "One of property is missing, required: " + requireKeys.join(", ")
        })
    }
    const { nameOfCompany, name, surname, phone, taxNumber, place, isVat, email, country, password } = req.body

    if (!req.files || !req.files.logo) {
        return res.status(400).send({
            msg: "Missing file with logo"
        })
    }

    const file = req.files.logo
    const allowMimeTypesOfLogo = ["image/jpeg", "image/png", "image/tiff"]

    if (allowMimeTypesOfLogo.includes(file.mimetype) === false) {
        return res.status(400).send({
            msg: "We allow only jpeg, png and tiff images"
        })
    }
    const splited = file.name.split(".")
    const ext = splited[splited.length - 1]

    const params = {
        Bucket: "cf-simple-s3-origin-calclogistic-556777295593/company_logos",
        Key: uuid() + "." + ext,
        Body: file.data,
        ACL: 'public-read'
    };

    s3bucket.upload(params, function (err, data) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Can not upload file to S3" })
        }
        const company = {
            nameOfCompany, name, surname, phone, taxNumber, place, isVat, email, country, logo: data.key, password
        }

        let countries = req.body.countries.split(",")
        const confirmCode = uuid()
        Company.create({ ...company, countries, confirmCode }).then((doc) => {
            let url = ""

            if (process.env.MODE === "DEV") {
                url = `http://localhost:3000/confirm/${confirmCode}`
            } else {
                url = `https://logistic-calc.com/confirm/${confirmCode}`
            }
            loadTemplate("confirmCreate", [
                { name, url }
            ])
                .then(async result => {
                    sendEmail({
                        to: doc.email,
                        subject: `Calc-Logistic Potwierdzenie założenia konta`,
                        html: result[0].email.html,
                        text: result[0].email.text
                    });

                    res.status(201).send({ msg: "Company created successfuly" })
                    try {
                        const { inviteCode } = req.body
                        if (inviteCode !== undefined) {
                            const invite = await Invite.findOne({ code: inviteCode, to: doc.email })
                            if (invite !== undefined) {
                                await Invite.updateOne({ code: inviteCode, to: doc.email }, { visited: true })
                            }
                        }
                    } catch (err) {
                        console.log(err)
                    }

                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).send({ msg: "Error while sending email" })
                });

        }).catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(400).send({ msg: "Email has to be unique" })
            }
            return res.status(422).send({})
        })


    })

}

export async function confirmCompany(req, res) {
    const requireKeys = [
        "confirmCode",
        "cardNumber",
        "firstnameOnCard",
        "lastnameOnCard",
        "postalCodeOnCard",
        "ccv"
    ];

    const checkRequire = checkIsObjectHasRequiredProperties(requireKeys, req.body)

    if (!checkRequire) {
        return res.status(400).send({
            msg: "One of property is missing, required: " + requireKeys.join(", ")
        })
    }

    const { confirmCode } = req.body

    const companyToConfirm = await Company.findOne({ confirmCode })
    if (!companyToConfirm) {
        return res.status(404).send({ msg: "Confirmation code doesn't exists" })
    }

    Company.updateOne({ confirmCode }, { isConfirmed: true }).then(async () => {

        res.status(201).send({ msg: "Company confirmed" })
        //check is new customer was invited
        try {
            const invite = await Invite.findOne({ to: companyToConfirm.email })
            if (invite) {
                const company = await Company.findOne({ _id: invite.from })
                if (company) {
                    const date = new Date(company.freeUseToDate.getTime())
                    if (company.isFreeSpaceUsed === false) {
                        date.setDate(date.getDate() + 14)
                    }
                    await Company.updateOne({ _id: invite.from }, { freeUseToDate: date, isFreeSpaceUsed: true })
                    await Invite.updateOne({ to: companyToConfirm.email }, { registered: true, visited: true })
                }
            }
        } catch (err) {
            console.log(err)
        }

    }).catch(err => {
        console.log(err)
        return res.status(500).send({ msg: "Unhandled Error" })
    })
}

export async function resetPassword(req, res) {
    const requireKeys = [
        "resetPassword",
        "password"
    ];


    const checkRequire = checkIsObjectHasRequiredProperties(requireKeys, req.body)

    if (!checkRequire) {
        return res.status(400).send({
            msg: "One of property is missing, required: " + requireKeys.join(", ")
        })
    }


    const company = await Company.findOne({
        email: req.user.email
    })
    if (!company) {
        return res.status(404).send({
            msg: "This company doesnt' exists"
        })
    }
    const { password, resetPassword } = req.body
    company.comparePassword(password, (err, isMatch) => {
        if (err || isMatch === false) {
            return res.status(400).send({
                msg: "Incorrect email or password"
            })
        }
        Company.updateOne({
            email: req.user.email
        }, {
                password: resetPassword
            }).then((res) => {
                res.send({
                    msg: "Password changed"
                })
            }).catch(err => {
                res.status(400).send({
                    msg: "Can not change password"
                })
            })
    })

}