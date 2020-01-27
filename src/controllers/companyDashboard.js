import Company from '../models/company'
import Vehicle from '../models/vehicle'

export async function getCompany(req, res) {
    const company = await Company.findOne({
        email: req.user.email
    }, { password: 0 })

    if (!company) {
        return res.status(400).send({
            msg: "Missing company"
        })
    }

    res.send({ company })
}

export async function createVehicle(req, res) {

    const requireKeys = [
        "minRange",
        "operationRange",
        "maxRange",
        "fuel",
        "combustion",
        "countries",
        "monthCosts",
        "salary",
        "numberOfAxles",
        "emissionLevel",
        "name",
        "capacity",
        "length",
        "width",
        "height",
        "deprecationPerYear",
        "valueOfTruck",
        "averageDistancePerMonth",
        "margin",
        "maxFreeTime",
        "pricePerHourWaiting",
        "permissibleGrossWeight"
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
        email: req.user.email,
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

    if (!comapny) {
        return res.status(401).send({
            msg: "Twoje konto nie istnieje lub zostało "
        })
    }
    let numberOfVehicles = 0
    const distinctVehicles = []
    for (let i = 0; i < comapny.companyBases.length; i++) {
        for (let k = 0; k < company.companyBases[i].vehicles.length; k++) {
            let isInside = false
            lp: for (let m = 0; m < distinctVehicles.length; m++) {
                if (distinctVehicles[m]._id.toString() === company.companyBases[i].vehicles[k]._id.toString()) {
                    isInside = true
                    break lp
                }
            }
            if (!isInside) {
                distinctVehicles.push({ ...company.companyBases[i].vehicles[k] })
                numberOfVehicles++
            }
            if (numberOfVehicles >= company.plan.vehicles) {
                return res.status(409).send({
                    msg: "Liczba pojazdów jest zbyt duża, skontaktuj się z adminitracją w celu "
                })
            }
        }
    }
    const {
        minRange,
        operationRange,
        maxRange,
        fuel,
        combustion,
        countries,
        monthCosts,
        salary,
        numberOfAxles,
        emissionLevel,
        name,
        capacity,
        length,
        width,
        height,
        deprecationPerYear,
        valueOfTruck,
        averageDistancePerMonth,
        margin,
        maxFreeTime,
        pricePerHourWaiting,
        permissibleGrossWeight
    } = req.body
    const vehicle = await Vehicle.create({

    })


}

export async function createCompanyBase(req, res) {

}