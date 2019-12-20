import Diets from "../models/diets";

export async function countRoadDiets(waypoints, time,listOfCountries) {
    const scaleOfTime = 1.2;
    let sumDiets = 0;
    const dietsTo24Hours = [
        {
            from: 0,
            to: 0.33,
            value: 1 / 3
        },
        {
            from: 0.33,
            to: 0.5,
            value: 1 / 2
        },
        {
            from: 0.5,
            to: 1,
            value: 1
        }
    ];
    const dietsAbove24Hours = [
        {
            from: 0,
            to: 0.5,
            value: 1 / 2
        },
        {
            from: 0.5,
            to: 1,
            value: 1
        }
    ];
    const avaiableHoursPerDay = [10, 10, 9, 9, 9, 9];
    const dietsInCountries = await Diets.find({
        countryName: {
            $in: listOfCountries
        }
    });
    let fullTime = time * scaleOfTime; //czas na dojazd w jednym kierunku
    let fullNumberOfDays = 0;
    let timeNeededCounter = 0;
    let ck = 0;

    while (timeNeededCounter < fullTime) {
        if (avaiableHoursPerDay[ck % 6] > fullTime - timeNeededCounter) {
            fullNumberOfDays += (fullTime - timeNeededCounter) / 24;
        } else {
            fullNumberOfDays += 1;
        }
        timeNeededCounter += avaiableHoursPerDay[ck % 6];
        if (ck != 0 && ck % 6 == 0) {
            fullNumberOfDays += 2;
        }
        ck++;
    }
    for (let l = 0; l < waypoints.length; l++) {
        let timeNeeded = (waypoints[l].duration.value / 60 / 60) * scaleOfTime; //czas na dojazd w jednym kierunku
        let numberOfDays = 0;
        let timeNeededCounter = 0;
        let ck = 0;

        while (timeNeededCounter < timeNeeded) {
            if (avaiableHoursPerDay[ck % 6] > timeNeeded - timeNeededCounter) {
                numberOfDays += (timeNeeded - timeNeededCounter) / 24;
            } else {
                numberOfDays += 1;
            }
            timeNeededCounter += avaiableHoursPerDay[ck % 6];
            if (ck != 0 && ck % 6 == 0) {
                numberOfDays += 2;
            }
            ck++;
        }
        let country = listOfCountries[l * 2 + 1];
        for (let c = 0; c < dietsInCountries.length; c++) {
            if (country === dietsInCountries[c].countryName) {
                country = dietsInCountries[c];
            }
        }
        if (fullNumberOfDays < 1) {
            for (let i = 0; i < dietsTo24Hours.length; i++) {
                if (
                    numberOfDays <= dietsTo24Hours[i].to &&
                    numberOfDays > dietsTo24Hours[i].from
                ) {
                    sumDiets += dietsTo24Hours[i].value * country.dietValueInPLN;
                }
            }
        } else {
            let counter = 0;
            while (numberOfDays > counter) {
                let isFull = false;
                for (let mk = 0; mk < dietsAbove24Hours.length; mk++) {
                    if (
                        !isFull &&
                        dietsAbove24Hours[mk].to + counter >= numberOfDays
                    ) {
                        isFull = true;
                        sumDiets +=
                            country.dietValueInPLN * dietsAbove24Hours[mk].value;
                        counter += dietsAbove24Hours[mk].to;
                    }
                }
                if (!isFull) {
                    sumDiets +=
                        country.dietValueInPLN *
                        dietsAbove24Hours[dietsAbove24Hours.length - 1].value;
                    counter += dietsAbove24Hours[dietsAbove24Hours.length - 1].to;
                }
            }
            sumDiets += Math.floor(numberOfDays) * country.dietValueInPLN * 1.5;
        }
    }
    return { sumDiets, fullNumberOfDays };
}