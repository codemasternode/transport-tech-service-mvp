import Company from '../models/company'
import jwt from 'jsonwebtoken'

export async function loginAuth(req, res) {
    const requireKeys = [
        "email",
        "password"
    ];

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
        return res.cookie("token", token, {
            expires: new Date(Date.now() + 604800000),
            secure: false,
            httpOnly: true
        }).send()
    })
}

export async function testAuth(req, res) {
    res.send({ user: req.user })
}