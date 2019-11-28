import Axios from "axios";
import googleMaps from "@google/maps";
import commandsPrior from '../data/default/commandsPrior'
import "dotenv/config"

const googleMapsClient = googleMaps.createClient({
  key: process.env.GOOGLE_API,
  Promise: Promise
});

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

export function createDistanceGoogleMapsRequest(points) {
  let distanceConfigObj = {
    origin: `${points[0].lat},${points[0].lng}`,
    destination: `${points[points.length - 1].lat},${points[points.length - 1].lng}`
  };
  if (points.length === 2) {
    return distanceConfigObj;
  } else {
    distanceConfigObj.waypoints = [];
    for (let i = 1; i < points.length - 1; i++) {
      distanceConfigObj.waypoints.push(`${points[i].lat},${points[i].lng}`);
    }
    return distanceConfigObj;
  }
}

export function getCountryNameByReverseGeocoding(lat, lng) {
  return new Promise((resolve, reject) => {
    googleMapsClient
      .reverseGeocode({ latlng: `${lat},${lng}`, result_type: "country" })
      .asPromise()
      .then(response => {
        resolve(response.json.results[0].formatted_address);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function getAdministrationRegionNameByReverseGeocoding(lat, lng) {
  return new Promise((resolve, reject) => {
    googleMapsClient
      .reverseGeocode({ latlng: `${lat},${lng}`, result_type: "administrative_area_level_1", language: "pl" })
      .asPromise()
      .then(response => {
        let name = null
        const result = response.json.results[0]
        for (let i = 0; i < result.address_components.length; i++) {
          if (result.address_components[i].types.includes("administrative_area_level_1")) {
            name = result.address_components[i].short_name
            break
          }
        }
        resolve(name);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function getCountryFromAddress(address) {
  address = address.split(",").reverse();
  return address[0].trim();
}

export function extractHtmlInstruction(htmlInstruction) {
  htmlInstruction = htmlInstruction.replace(/<\/?[^>]+(>|$)/g, "")
  const roadSigns = htmlInstruction.match(/[a-z][0-9]+/gim);
  return roadSigns;
}
