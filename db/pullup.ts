import { Db } from "mongodb";
import { GLocation, PullUp } from "../types";

//@ts-ignore
export async function getPullUps(
  db: Db,
  from: GLocation,
  by: string,
  limit: number
) {
  return (
    db
      .collection("pullups")
      .find({
        // Pagination: Fetch pullups that match specific lat/long
        ...(from && {
          "location.lat": from.lat,
          "location.lng": from.lng,
        }),
        ...(by && { creatorId: by }),
      })
      // .sort({ location: -1 })
      .limit(limit)
      .toArray()
  );
}

export async function findPullUpById(db: Db, pullupId: string) {
  return db
    .collection("pullups")
    .findOne({
      _id: pullupId,
    })
    .then((pullup) => pullup || "No PullUp Found for id: " + pullupId);
}

export async function insertPullUp(db: Db, data: PullUp) {
  const { uid } = data;

  return db.collection("pullups").insertOne({
    ...data,
    uid: uid,
  });
  // .then(({ ops }) => ops[0]);
}

export async function updatePullUpById(db: Db, id: string, update: object) {
  console.log(id);
  return db
    .collection("pullups")
    .findOneAndUpdate({ _id: id }, { $set: update })
    .then(({ value }) => value);
}
