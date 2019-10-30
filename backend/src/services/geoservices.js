import Axios from "axios";

export function getDistanceFromLatLonInKm(point1, point2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(point2.lat - point1.lat); // deg2rad below
  var dLon = deg2rad(point2.lng - point1.lng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) *
      Math.cos(deg2rad(point2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function createDistanceGoogleMapsURL(points) {
  const origin = points[0];
  const destination = points[points.length - 1];
  let baseURL = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat}, ${origin.lng}&destination=${destination.lat},${destination.lng}&key=${process.env.GOOGLE_API}&mode=driving`;
  if (points.length === 2) {
    return baseURL;
  } else {
    baseURL += "&waypoints=";
    for (let i = 1; i < points.length - 1; i++) {
      if (i === points.length - 2) {
        baseURL += `${points[i].lat},${points[i].lng}`;
      } else {
        baseURL += `${points[i].lat},${points[i].lng}|`;
      }
    }
    return baseURL;
  }
}

export async function getCountryNameByReverseGeocoding(lat,lng) {
  const baseURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API}&result_type=country`
  try {
    const address = await Axios({
      url: baseURL
    })
    return address
  }catch(err) {
    throw new Error("Problem with Geocoding location")
  }
}


export function getCountryFromAddress(address) {
  address = address.split(",").reverse();
  return address[0].trim();
}
