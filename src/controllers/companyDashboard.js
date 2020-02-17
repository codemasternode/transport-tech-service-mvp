import Company from '../models/company'
import Vehicle from '../models/vehicle'
import Fuel from '../models/fuel'
import { Types } from 'mongoose'

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

    let company = await Company.findOne({
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

    company = JSON.parse(JSON.stringify(company))

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
                    msg: "Liczba pojazdów jest zbyt duża, poszerz swój plan"
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

        company.maxMonthUsage.vehicles++

        const updateStats = await Company.updateOne({
            email: req.user.email
        }, company).session(session)

        if (updateStats.nModified === 0 && updateStats.ok === 0) {
            throw new Error("Nic nie zmieniono")
        }

        res.send({ vehicle })
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
        "lat",
        "lng"
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
        if (company.companyBases[i].name === req.body.name) {
            return res.status(400).send({
                msg: "Nazwa bazy musi być unikatowa"
            })
        }
    }

    const copyCompany = JSON.parse(JSON.stringify(company))
    console.log(copyCompany)
    copyCompany.companyBases.push({ ...req.body, location: { lat: req.body.lat, lng: req.body.lng }, vehicles: [] })



    const updateStats = await Company.updateOne({
        email: req.user.email
    }, {
        ...copyCompany
    })

    if (updateStats.nModified === 0 && updateStats.ok === 0) {
        return res.status(400).send({
            msg: "Nic nie zmieniono"
        })
    }

    res.send({})
}

export async function deleteVehicle(req, res) {
    const requireKeys = [
        "companyBase",
        "name"
    ]

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
        email: req.user.email
    })

    if (!company) {
        return res.status(401).send({
            msg: "Firma nie istnieje lub została zbanowana"
        })
    }
    const { name, companyBase } = req.body
    const copyCompany = JSON.parse(JSON.stringify(company))
    let numberOfExisting = 0
    let vehicleId = null
    for (let i = 0; i < copyCompany.companyBases.length; i++) {
        for (let k = 0; k < copyCompany.companyBases[i].vehicles.length; k++) {
            if (copyCompany.companyBases[i].vehicles[k].name === name) {
                numberOfExisting++
                vehicleId = copyCompany.companyBases[i].vehicles[k]._id.toString()
            }
            if (copyCompany.companyBases[i].name === companyBase && copyCompany.companyBases[i].vehicles[k].name === name) {
                copyCompany.companyBases[i].vehicles.splice(k, 1)
            }
        }
    }

    if (numberOfExisting === 0) {
        return res.status(404).send({
            msg: "Pojazd nie istnieje, odśwież stronę"
        })
    }

    const session = await Company.startSession()
    session.startTransaction()
    try {

        const updated = await Company.updateOne({
            email: req.user.email
        }, copyCompany, { session })

        if (updated.nModified === 0) {
            throw new Error("Nic nie zmodyfikowano, odśwież stronę")
        }

        if (numberOfExisting === 1) {
            const deleted = await Vehicle.deleteMany({
                _id: vehicleId
            }, { session })

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

export async function deleteCompanyBase(req, res) {
    const requireKeys = [
        "name"
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
        email: req.user.email
    })

    if (!company) {
        return res.status(400).send({
            msg: "Firma nie istnieje"
        })
    }

    const copyCompany = JSON.parse(JSON.stringify(company))
    let vehiclesToDelete = []

    let isInside = false
    for (let i = 0; i < copyCompany.companyBases.length; i++) {
        if (copyCompany.companyBases[i].name === req.body.name) {
            vehiclesToDelete = copyCompany.companyBases[i].vehicles
            copyCompany.companyBases.splice(i, 1)
            isInside = true
        }
    }
    for (let m = 0; m < vehiclesToDelete.length; m++) {
        for (let i = 0; i < copyCompany.companyBases.length; i++) {
            for (let k = 0; k < copyCompany.companyBases[i].vehicles.length; k++) {
                if (vehiclesToDelete[m]._id.toString() === copyCompany.companyBases[i].vehicles._id.toString()) {
                    vehiclesToDelete.splice(m, 1)
                    i--
                }
            }
        }
    }
    console.log(vehiclesToDelete)
    vehiclesToDelete = vehiclesToDelete.map((value) => {
        return value._id.toString()
    })

    const session = await Vehicle.startSession()
    session.startTransaction()
    try {

        const updated = await Company.updateOne({
            email: req.user.email
        },
            copyCompany, { session }
        )
        console.log(updated)

        if (updated.nModified === 0) {
            throw new Error("Nie udało się zmodyfikować, odśwież stronę")
        }
        console.log(vehiclesToDelete)
        const deleted = await Vehicle.deleteMany({
            _id: {
                $in: vehiclesToDelete
            }
        })
        if (deleted.deletedCount !== vehiclesToDelete.length) {
            throw new Error("Nie udało się zmodyfikować, odśwież stronę")
        }
        console.log(deleted)
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

export async function updateVehicle(req, res) {
    const requireKeys = ["_id"]
    const allowProperties = [
        "_id",
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
        if (allowProperties.includes(key) === false) {
            return res.status(400).send({
                msg: `This property is banned ${key}`
            })
        }
    }

    const company = await Company.findOne({
        email: req.user.email
    })
    if (!company) {
        return res.status(401).send({
            msg: "Twoje konto wygasło lub zostało zawieszone"
        })
    }

    const dimensionsProperties = ["length", "width", "height"]
    const rangeProperties = ["maxRange", "minRange", "operationRange"]

    const copyCompany = JSON.parse(JSON.stringify(company))
    const properitesToupdate = {}
    for (let key in req.body) {
        if (dimensionsProperties.includes(key)) {
            properitesToupdate.dimensions = {
                ...properitesToupdate.dimensions,
                [key]: req.body[key]
            }
        }
        else if (rangeProperties.includes(key)) {
            properitesToupdate.range = {
                ...properitesToupdate.range,
                [key]: req.body[key]
            }
        }
        else if (key === "fuel") {
            const fuel = await Fuel.findOne({
                name: req.body[key]
            })

            if (!fuel) {
                return res.status(400).send({
                    msg: "Taki typ paliwa nie istnieje"
                })
            }

            properitesToupdate["fuel"] = { ...fuel }

        }
        else if (key !== "_id") {
            properitesToupdate[key] = req.body[key]
        }
    }

    const session = await Vehicle.startSession()
    session.startTransaction()
    try {
        const updated = await Vehicle.updateOne({
            _id: req.body._id
        }, properitesToupdate).session(session)

        if (updated.nModified === 0) {
            throw new Error("Nie udało się zmodyfikować, odśwież stronę")
        }

        for (let i = 0; i < copyCompany.companyBases.length; i++) {
            for (let k = 0; k < copyCompany.companyBases[i].vehicles.length; k++) {
                if (copyCompany.companyBases[i].vehicles[k]._id.toString() === req.body._id) {
                    copyCompany.companyBases[i].vehicles[k] = {
                        ...copyCompany.companyBases[i].vehicles[k],
                        ...properitesToupdate
                    }
                }
                if (copyCompany.companyBases[i].vehicles[k]._id.toString() !== req.body._id && copyCompany.companyBases[i].vehicles[k].name === properitesToupdate.name) {
                    return res.status(400).send({
                        msg: "Nazwa pojazdu musi być unikatowa"
                    })
                }
            }
        }

        const updatedCompany = await Company.updateOne({
            email: req.user.email
        }, copyCompany).session(session)

        if (updatedCompany.nModified === 0) {
            throw new Error("Nie udało się zmodyfikować, odśwież stronę")
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

export async function updateCompanyBase(req, res) {
    const requireKeys = ["name"]
    const allowProperties = [
        "name", "street", "postalCode", "city", "country", "lat", "lng"
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
        if (allowProperties.includes(key) === false) {
            return res.status(400).send({
                msg: `This property is banned ${key}`
            })
        }
    }

    const properitesToupdate = {}
    for (let key in req.body) {
        properitesToupdate[key] = req.body[key]
    }

    const company = await Company.findOne({
        email: req.user.email
    })

    if (!company) {
        return res.status(401).send({
            msg: "Konto nie istnieje lub zostało zawieszone"
        })
    }

    const copyCompany = JSON.parse(JSON.stringify(company))

    const session = await Company.startSession()
    session.startTransaction()
    try {

        for (let i = 0; i < copyCompany.companyBases.length; i++) {
            if (req.body.name === copyCompany.companyBases[i].name) {
                copyCompany.companyBases[i] = {
                    ...copyCompany.companyBases[i],
                    ...properitesToupdate
                }
            }
        }

        const updated = await Company.updateOne({
            email: req.user.email
        }, copyCompany).session(session)

        if (updated.nModified === 0) {
            throw new Error("Nic nie zmieniono, odśwież stronę")
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
