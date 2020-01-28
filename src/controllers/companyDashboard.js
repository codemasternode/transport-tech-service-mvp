import Company from '../models/company'
import Vehicle from '../models/vehicle'
import Fuel from '../models/fuel'

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
        "permissibleGrossWeight",
        "companyBase"
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

    if (!company) {
        return res.status(401).send({
            msg: "Twoje konto nie istnieje lub zostało usunięte "
        })
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
        permissibleGrossWeight,
        companyBase
    } = req.body

    let numberOfVehicles = 0
    const distinctVehicles = []
    for (let i = 0; i < company.companyBases.length; i++) {
        for (let k = 0; k < company.companyBases[i].vehicles.length; k++) {
            if (name === company.companyBases[i].vehicles[k].name) {
                return res.status(400).send({
                    msg: "Nazwa pojazdu musi być unikatowa"
                })
            }

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
                    msg: "Liczba pojazdów jest zbyt duża, w celu poszerzenia planu skontaktuj się z administracją "
                })
            }
        }
    }

    const session = await Vehicle.startSession()
    session.startTransaction()
    try {
        const opts = { session }

        const fuelFromDB = await Fuel.findOne({
            name: fuel
        }, {}, opts)
        if (!fuelFromDB) {
            throw new Error("Paliwo nie istnieje, skontaktuj się z administratorem w tej sprawie")
        }

        const [vehicle] = await Vehicle.create([{
            name,
            combustion,
            capacity,
            dimensions: {
                width, length, height
            },
            deprecationPerYear,
            valueOfTruck,
            averageDistancePerMonth,
            range: {
                maxRange,
                minRange,
                operationRange
            },
            margin,
            waitingTimeParams: {
                maxFreeTime,
                pricePerHourWaiting
            },
            fuel: fuelFromDB,
            countries,
            salary,
            numberOfAxles,
            emissionLevel,
            monthCosts,
            permissibleGrossWeight,
            sumCostsPerMonth: company.sumCostsPerMonth,
            sumKmPerMonth: averageDistancePerMonth + company.sumKmPerMonth
        }], { session })

        let isInside = false
        for (let i = 0; i < company.companyBases.length; i++) {
            if (company.companyBases[i].name === companyBase) {
                company.companyBases[i].vehicles.push(vehicle)
                isInside = true
            }
        }
        if (!isInside) {
            throw new Error("Baza nie istnieje")
        }

        const updateStats = await Company.updateOne({
            email: req.user.email
        }, company).session(session)

        if (updateStats.nModified === 0 && updateStats.ok === 0) {
            throw new Error("Nic nie zmieniono")
        }

        res.send({})
        await session.commitTransaction();
        session.endSession();

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).send({
            msg: err.toString().substring(7)
        })
    }


}

export async function createCompanyBase(req, res) {
    //unikatowa nazwa bazy pojazdów dla firmy
    const requireKeys = [
        "name",
        "street",
        "postalCode",
        "city",
        "country",
        "location"
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

    for (let key in req.body) {
        if (requireKeys.includes(key) === false) {
            return res.status(400).send({
                msg: "This properites are allow: " + requireKeys.join(", ")
            })
        }
    }

    const company = await Company.findOne({
        email: req.user.email
    })

    if (!company) {
        res.status(401).send({
            msg: "Firma nie istnieje"
        })
    }

    for (let i = 0; i < company.companyBases.length; i++) {
        if (company.companyBases[i].name === name) {
            return res.status(400).send({
                msg: "Nazwa bazy musi być unikatowa"
            })
        }
    }

    const updateStats = await Company.updateOne({
        email: req.user.email
    }, {
            ...req.body
        })

    if (updateStats.nModified === 0 && updateStats.ok === 0) {
        return res.status(400).send({
            msg: "Nic nie zmieniono"
        })
    }
    
    res.send({})
}

export async function deleteVehicle(req, res) { }

export async function deleteCompanyBase(req, res) { }

export async function updateVehicle(req, res) { }

export async function updateCompanyBase(req, res) { }
