export function search(array, dimensions, capacity) {
  const demandVolume = dimensions.width * dimensions.height * dimensions.length;
  const chooseVehicles = [];
  array.sort((a, b) => a.fullCost - b.fullCost);
  for (let i = 0; i < array.length; i++) {
    const { width, height, length } = array[i].dimensions;
    const vehicleVolume = width * height * length;
    if (vehicleVolume > demandVolume && array[i].capacity > capacity) {
      chooseVehicles.push(array[i]);
      return chooseVehicles;
    }
  }

  let enoughVolume = 0;
  let enoughCapacity = 0;
  for (let i = 0; i < array.length; i++) {
    const { width, height, length } = array[i].dimensions;
    const vehicleVolume = width * height * length;
    chooseVehicles.push(array[i]);
    enoughVolume += vehicleVolume;
    enoughCapacity += array[i].capacity;
    if (enoughVolume > demandVolume && enoughCapacity > capacity) {
      return chooseVehicles;
    }
  }
  return null;
}
