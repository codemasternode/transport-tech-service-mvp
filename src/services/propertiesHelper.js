export function checkIsObjectHasRequiredProperties(arrayOfRequiredProperties, objectToCheck) {
    for (let i = 0; i < arrayOfRequiredProperties.length; i++) {
        let isInside = false;
        for (let key in objectToCheck) {
            if (arrayOfRequiredProperties[i] === key) {
                isInside = true;
            }
        }
        if (!isInside) {
            return false
        }
    }
    return true
}

export function checkIsObjectHasOnlyAllowProperties(arrayOfAllowProperties, objectToCheck){
    for (let key in objectToCheck) {
        if (arrayOfAllowProperties.includes(key) === false) {
            return false
        }
    }
    return true
}
