import Company from '../models/company'
import { checkIsObjectHasOnlyAllowProperties, checkIsObjectHasRequiredProperties } from '../services/propertiesHelper'

export async function getPaymentPlan(req, res) {

    const company = await Company.findOne({ email: req.user.email })
    if (!company) {
        return res.status(401).send({ msg: "Twoja firma nie istnieje lub została zbanowana" })
    }

    if (Date.now() < company.freeUseToDate) {
        return res.send({
            plan: company.plan,
            currentPay: 0
        })
    }

    res.send({
        plan: company.plan,
        currentPay: company.maxMonthUsage.vehicles * 50 + company.maxMonthUsage.companyBases * 10
    })

}

export async function modifyPaymentPlan(req, res) {
    let company = await Company.findOne({ email: req.user.email })
    if (!company) {
        return res.status(401).send({ msg: "Twoja firma nie istnieje lub została zbanowana" })
    }

    company = JSON.parse(JSON.stringify(company))

    const currentResources = {
        companyBases: company.companyBases.length,
        vehicles: 0
    }
    const distinctVehicles = []
    for (let i = 0; i < company.companyBases.length; i++) {
        for (let j = 0; j < company.companyBases[i].vehicles.length; j++) {
            let isInside = false
            for (let k = 0; k < distinctVehicles.length; k++) {
                if (distinctVehicles[k]._id.toString() === company.companyBases[i].vehicles[j]._id.toString()) {
                    isInside = true
                }
            }
            if (!isInside) {
                distinctVehicles.push(company.companyBases[i].vehicles[j])
            }
        }
    }

    currentResources.vehicles = distinctVehicles.length

    if (req.body.companyBases < currentResources.companyBases) {
        return res.status(400).send({
            msg: "Musisz usunąć bazy aby zmienić swój plan"
        })
    }

    if (req.body.vehicles < currentResources.vehicles) {
        return res.status(400).send({
            msg: "Musisz usunąć pojazdy aby zmienić swój plan"
        })
    }

    const updateStat = await Company.updateOne({ email: req.user.email }, {
        plan: {
            companyBases: req.body.companyBases,
            vehicles: req.body.vehicles
        },
    })

    if (updateStat.nModified === 0) {
        return res.status(400).send({
            msg: "Nic nie zmieniono"
        })
    }

    res.send({})

}

