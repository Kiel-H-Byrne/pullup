import { useCallback } from "react";
import { GLocation, PullUp } from "../types";

export const targetClient = function (map: any, pos: any) {
  // SET CENTER,
  // ZOOM TO CERTAIN LEVEL
  map.panTo(pos);
  // google.maps.event.trigger(map, 'resize');
  map.setZoom(17);
};

export const toPositionObj = (location: string | undefined) => {
  if (location) {
    let latLng = location.split(",");
    let lat = Number(latLng[0]);
    let lng = Number(latLng[1]);
    let pos = new (window as any).google.maps.LatLng({ lat: lat, lng: lng });
    return pos;
  }
};

export const findClosestMarker = function (
  markers: any[], //Listing[],
  location: GLocation
) {
  // marker {position: latlngObj, map: mapinstnace, icon: iconurl}
  let distances = [""];
  let closest = -1;
  const start = new (window as any).google.maps.LatLng(location);
  for (let i = 0; i < markers.length; i++) {
    if (markers[i].location) {
      let d = (window as any).google.maps.geometry.spherical.computeDistanceBetween(
        toPositionObj(markers[i].location),
        start
      );
      distances[i] = d;
      if (closest === -1 || d < distances[closest]) {
        closest = i;
      }
    }
  }
  const closestMarker = markers[closest];
  return closestMarker;
};

export const getTruncated = (float: number) => Math.trunc(float);

export const toThreePlaces = (num: number) => num.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0]

export const makeLocationStringKey = (loc: GLocation) => `{lng: ${toThreePlaces(loc.lng)}, lat: ${toThreePlaces(loc.lat)}}`;

export const checkForOverlaps = (data: PullUp[]) => {
  const result: { [key: string]: PullUp[] } = data.reduce(function (r, a) {
    // const locString = `{lng: ${toThreePlaces(a.location.lng)}, lat: ${toThreePlaces(a.location.lat)}}`
    const locString = makeLocationStringKey(a.location);
    r[locString] = r[locString] || [];
    r[locString].push(a);
    return r;
  }, Object.create(null) as { [key: string]: PullUp[] });
  //result is now an object with key of lat/long string
  // const iwData = Object.values(result).find(el => el.length > 1);
  return result;
}
