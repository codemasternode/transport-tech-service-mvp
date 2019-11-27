const fs = require("fs")
const path = require("path")

const start = 1
const end = 535
const prefix = "B"
const country = "Germany"
const dataToPut = {
    "country": country,
    "route": [
        {
            "mainDirection": "NORTH",
            "pricingPlans": [
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 1"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 2"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 3"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 4"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 5"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 6"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 1"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.72,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 2"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.67,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 3"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.63,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 4"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.5,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 5"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.45,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 6"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.4,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 1"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.87,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 2"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.82,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 3"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.78,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 4"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.64,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 5"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.6,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 6"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.55,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 1"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 1.07,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 2"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 1.02,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 3"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.98,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 4"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.84,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 5"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.79,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 6"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.75,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 1"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 1.13,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 2"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 1.08,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 3"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 1.03,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 4"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.9,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 5"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.85,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 6"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.81,
                    "currency": "EUR"
                }
            ]
        },
        {
            "mainDirection": "SOUTH",
            "pricingPlans": [
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 1"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 2"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 3"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 4"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 5"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 0,
                            "to": 7.55
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 6"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 1"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.72,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 2"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.67,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 3"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.63,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 4"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.5,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 5"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.45,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 7.55,
                            "to": 12
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 6"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.4,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 1"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.87,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 2"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.82,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 3"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.78,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 4"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.64,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 5"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.6,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "permissibleGrossWeight",
                            "from": 12,
                            "to": 18
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 6"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.55,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 1"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 1.07,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 2"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 1.02,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 3"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.98,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 4"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.84,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 5"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.79,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "value": 3
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 6"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.75,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 1"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 1.13,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 2"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 1.08,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 3"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 1.03,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 4"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.9,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 5"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.85,
                    "currency": "EUR"
                },
                {
                    "name": "Kategoria 3",
                    "requirePropertyValue": [
                        {
                            "name": "numberOfAxles",
                            "from": 4,
                            "to": 100
                        },
                        {
                            "name": "permissibleGrossWeight",
                            "from": 18,
                            "to": 100
                        },
                        {
                            "name": "emissionLevel",
                            "value": "EURO 6"
                        }
                    ],
                    "paymentPoints": null,
                    "costPerKm": 0.81,
                    "currency": "EUR"
                }
            ]
        }
    ]
}

const target = []
for (let i = start; i <= end; i++) {
    target.push({
        nameOfRoad: prefix + i,
        ...dataToPut
    })
}

fs.readFile(path.join("../data/default/tollRoads.json"), (err, data) => {
    const current = JSON.parse(data)
    fs.writeFile("roads.json", JSON.stringify([...target, ...current]), "utf8", (err) => {
        console.log(err)
    })
})




