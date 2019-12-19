const vehiclesWithVolume = [
  "Silos",
  "Cysterna chemiczna",
  "Cysterna gazowa",
  "Cysterna paliwowa"
];

export function search(array, dimensions, capacityOrVolume, type) {
  if (type === "capacity") {
    const demandVolume =
      dimensions.width * dimensions.height * dimensions.length;
    let chooseVehicles = [];
    array.sort((a, b) => a.fullCost - b.fullCost);
    for (let i = 0; i < array.length; i++) {
      const { width, height, length } = array[i].dimensions;
      const vehicleVolume = width * height * length;
      if (
        vehicleVolume > demandVolume &&
        array[i].capacity > capacityOrVolume
      ) {
        chooseVehicles.push(array[i]);
        return chooseVehicles;
      }
    }
    chooseVehicles = [];
    let enoughVolume = 0;
    let enoughCapacity = 0;
    array.sort((a, b) => {
      return b.capacity - a.capacity;
    });
    for (let i = 0; i < array.length; i++) {
      const { width, height, length } = array[i].dimensions;
      const vehicleVolume = width * height * length;
      chooseVehicles.push(array[i]);
      enoughVolume += vehicleVolume;
      enoughCapacity += array[i].capacity;
      if (enoughVolume > demandVolume && enoughCapacity > capacityOrVolume) {
        return chooseVehicles;
      }
    }
    return null;
  } else if (type === "volume") {
    let chooseVehicles = [];
    array.sort((a, b) => a.fullCost - b.fullCost);
    for (let i = 0; i < array.length; i++) {
      if (array[i].volume > capacityOrVolume) {
        chooseVehicles.push(array[i]);
        return chooseVehicles;
      }
    }
    chooseVehicles = [];
    let enoughVolume = 0;
    array.sort((a, b) => {
      return b.volume - a.volume;
    });
    for (let i = 0; i < array.length; i++) {
      chooseVehicles.push(array[i]);
      enoughVolume += array[i].volume;
      if (enoughVolume > capacityOrVolume) {
        return chooseVehicles;
      }
    }
    return null;
  }
}
