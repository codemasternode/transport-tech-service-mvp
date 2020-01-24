import {getRoadCode} from './getRoadCode'
import TollRoad from '../models/tollRoads'
import {getDistanceFromLatLonInKm} from './geoservices'

export async function countTollPayments(waypoints) {
    const tollRoads = [];
    const tollCounts = []
    async function countOneTollRoad(i, k, ex, value, waypoints, extracted) {
        const { start_location, end_location } = waypoints[i].steps[k];
        const mainDirections = {
            latitudeDifference: Math.abs(
                end_location.lat - start_location.lat
            ),
            longitudeDifference: Math.abs(
                end_location.lng - start_location.lng
            ),
            latitudeDirection:
                start_location.lat > end_location.lat
                    ? "SOUTH"
                    : start_location.lat === end_location.lat
                        ? "NONE"
                        : "NORTH",
            longitudeDirection:
                start_location.lng > end_location.lng
                    ? "WEST"
                    : start_location.lng === end_location.lng
                        ? "NONE"
                        : "EAST"
        };
        const tollRoad = await TollRoad.findOne({
            nameOfRoad: extracted[ex]
        });
        let mainDirection = null;
        if (tollRoad) {
            let tollRoadPrepare = {
                name: extracted[ex],
                pricingPlans: []
            };
            for (let m = 0; m < tollRoad.route.length; m++) {
                if (
                    mainDirections.latitudeDirection ===
                    tollRoad.route[m].mainDirection ||
                    mainDirections.longitudeDirection ===
                    tollRoad.route[m].mainDirection
                ) {
                    mainDirection = tollRoad.route[m];
                    for (
                        let g = 0;
                        g < mainDirection.pricingPlans.length;
                        g++
                    ) {
                        if (mainDirection.pricingPlans[g].paymentPoints) {
                            const { paymentPoints } = mainDirection.pricingPlans[
                                g
                            ];
                            let startPoint = null;
                            let endPoint = null;
                            let nearestDistance = {
                                number: 0,
                                value: getDistanceFromLatLonInKm(
                                    paymentPoints[0].location,
                                    end_location
                                )
                            };
                            for (let mg = 0; mg < paymentPoints.length; mg++) {
                                if (
                                    getDistanceFromLatLonInKm(
                                        paymentPoints[mg].location,
                                        start_location
                                    ) < nearestDistance.value
                                ) {
                                    nearestDistance = {
                                        number: mg,
                                        value: getDistanceFromLatLonInKm(
                                            paymentPoints[mg].location,
                                            start_location
                                        )
                                    };
                                }
                            }
                            startPoint = nearestDistance.number;
                            nearestDistance = {
                                number: 0,
                                value: getDistanceFromLatLonInKm(
                                    paymentPoints[0].location,
                                    end_location
                                )
                            };
                            for (let mg = 0; mg < paymentPoints.length; mg++) {
                                if (
                                    getDistanceFromLatLonInKm(
                                        paymentPoints[mg].location,
                                        end_location
                                    ) < nearestDistance.value
                                ) {
                                    nearestDistance = {
                                        number: mg,
                                        value: getDistanceFromLatLonInKm(
                                            paymentPoints[mg].location,
                                            end_location
                                        )
                                    };
                                }
                            }
                            endPoint = nearestDistance.number;
                            let costsForWholeDistance = 0;
                            for (let kl = startPoint; kl <= endPoint; kl++) {
                                costsForWholeDistance += paymentPoints[kl].cost;
                            }
                            tollRoadPrepare.pricingPlans.push({
                                requirePropertyValue:
                                    mainDirection.pricingPlans[g]
                                        .requirePropertyValue,
                                costsForWholeDistance
                            });
                        } else {
                            //policz kilometrowo cenę
                            tollRoadPrepare.pricingPlans.push({
                                requirePropertyValue:
                                    mainDirection.pricingPlans[g]
                                        .requirePropertyValue,
                                costsForWholeDistance:
                                    (value *
                                        mainDirection.pricingPlans[g].costPerKm) /
                                    1000
                            });
                        }
                    }
                }
            }
            tollRoads.push(tollRoadPrepare);
        }
    }
    for (let i = 0; i < waypoints.length; i++) {
        for (let k = 0; k < waypoints[i].steps.length; k++) {
            const {
                distance: { value }
            } = waypoints[i].steps[k];
            if (value > 1000) {
                const htmlInstruction = waypoints[i].steps[k].html_instructions;
                const extracted = getRoadCode(htmlInstruction);
                if (
                    extracted
                ) {
                    for (let ex = 0; ex < extracted.length; ex++) {
                        tollCounts.push(countOneTollRoad(i, k, ex, value, waypoints, extracted))
                    }
                }
            }
        }
    }
    await Promise.all(tollCounts)
    return tollRoads;
}