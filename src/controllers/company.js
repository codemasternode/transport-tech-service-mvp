import Company from '../models/company'
import uuid from 'uuid/v1'
import AWS from 'aws-sdk'
import { loadTemplate, sendEmail } from "../config/mailer";

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
        "countries"
    ];

    const { nameOfCompany, name, surname, phone, taxNumber, place, isVat, email, country } = req.body
    for (let i = 0; i < requireKeys.length; i++) {
        let isInside = false;
        for (let key in req.body) {
            if (requireKeys[i] === key) {
                isInside = true;
            }
        }
        if (!isInside) {
            return res.status(400).send({
                msg: `Missing Parameter ${requireKeys[i]}`
            });
        }
    }


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
            nameOfCompany, name, surname, phone, taxNumber, place, isVat, email, country, logo: data.key
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
                .then(result => {
                    sendEmail({
                        to: doc.email,
                        subject: `Calc-Logistic Potwierdzenie założenia konta`,
                        html: result[0].email.html,
                        text: result[0].email.text
                    });
                    return res.status(201).send({ msg: "Company created successfuly" })
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
    if (!req.body.confirmCode) {
        return res.status(400).send({ msg: "Missing parameter confirmCode" })
    }

    const { confirmCode } = req.body

    const company = await Company.findOne({ confirmCode })
    if (!company) {
        return res.status(404).send({ msg: "Confirmation code doesn't exists" })
    }

    Company.updateOne({ confirmCode }, { isConfirmed: true }).then(() => {
        return res.status(201).send({ msg: "Company confirmed" })
    }).catch(err => {
        console.log(err)
        return res.status(500).send({ msg: "Unhandled Error" })
    })
}
