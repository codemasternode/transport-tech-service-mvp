export function average(array) {
    let total = array.reduce((total, value) => {
        return total + value;
    });
    return total / array.length;
}