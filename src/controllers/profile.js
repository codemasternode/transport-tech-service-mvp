import Company from '../models/company'

export async function getProfileInfo(req, res) {
    const company = await Company.findOne({
        email: req.user.email
    }, {
        plan: 1,
        isVat: 1,
        endSubscription: 1,
        countries: 1,
        freeUseToDate: 1,
        nameOfCompany: 1,
        name: 1,
        surname: 1,
        phone: 1,
        taxNumber: 1,
        place: 1,
        country: 1
    })

    if (!company) {
        return res.status(400).send({
            msg: "Firma nie istnieje lub została zablokowana"
        })
    }

    res.send({
        company
    })
}

export async function updateProfileInfo(req, res) {
    const allowPropertiesToUpdate = [
        "logo",
        "nameOfCompany",
        "name",
        "surname",
        "phone",
        "taxNumber",
        "place",
        "country",
        "sumCostPerMonth",
        "isVat"
    ]

    for (let key in req.body) {
        if (allowPropertiesToUpdate.includes(key) === false) {
            return res.status(400).send({
                msg: "You can update only this properties: " + allowPropertiesToUpdate.join(", ")
            })
        }
    }

    try {
        const updateStat = await Company.updateOne({
            email: req.user.email
        }, {
            ...req.body
        })
        if (updateStat.nModified === 0) {
            throw new Error("Nic nie zmieniono")
        }
        res.send({
            msg: "Updated"
        })
    } catch (err) {
        return res.status(400).send({
            msg: err.toString()
        })
    }
}
