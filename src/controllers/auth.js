import Company from '../models/company'
import jwt from 'jsonwebtoken'
import { checkIsObjectHasOnlyAllowProperties, checkIsObjectHasRequiredProperties } from '../services/propertiesHelper'

export async function loginAuth(req, res) {
    const requireKeys = [
        "email",
        "password"
    ];

    const checkRequire = checkIsObjectHasRequiredProperties(requireKeys, req.body)

    if (!checkRequire) {
        return res.status(400).send({
            msg: "One of property is missing, required: " + requireKeys.join(", ")
        })
    }

    const company = await Company.findOne({
        email: req.body.email,
        isSuspended: false,
        $or: [
            {
                endDateSubscription: {
                    $lt: new Date()
                }
            },
            {
                freeUseToDate: {
                    $lt: new Date()
                }
            }
        ],
        isConfirmed: true
    })

    if (!company) {
        return res.status(404).send({
            msg: "This company doesnt' exists"
        })
    }

    company.comparePassword(req.body.password, (err, isMatch) => {
        if (err || isMatch === false) {
            return res.status(400).send({
                msg: "Incorrect email or password"
            })
        }
        const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
        const expiresAt = new Date(Date.now() + 604800000)
        return res.cookie("token", token, {
            expires: expiresAt,
            secure: false,
            httpOnly: true
        }).send({ expiresAt })
    })
}

export async function logout(req, res) {
    res.clearCookie("token")
    res.send({
        msg: "Wylogowano"
    })
}

export async function testAuth(req, res) {
    res.send({ user: req.user })
}