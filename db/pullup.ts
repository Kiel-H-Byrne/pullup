import { ObjectId } from "mongodb";
import { PullUp } from "../types";

//@ts-ignore
export async function getPullUps(db, from: string, by: string, limit: number) {
  return db
    .collection("pullups")
    .find({
      // Pagination: Fetch pullups from before the input date or fetch from newest
      ...(from && {
        submitDate: {
          $lte: new Date(), //less than today
          $gte: new Date(from), //greater than or equal to three weeks ago
        },
      }),
      // ...(by && { creatorId: by }),
    })
    .sort({ points: -1 })
    .limit(limit)
    .toArray();
}

export async function findPullUpById(db, pullupId: string) {
  return db
    .collection("pullups")
    .findOne({
      _id: typeof pullupId === "string" ? pullupId : new ObjectId(pullupId)
    })
    .then((pullup) => pullup || "No PullUp Found for id: " + pullupId);
}

export async function insertPullUp(db, data: PullUp) {
  const { uid, pullupAmount, entryPrice } = data;
  const riskAmount =
    pullupAmount && entryPrice ? pullupAmount * entryPrice : null;
  return db
    .collection("pullups")
    .insertOne({
      ...data,
      uid: new ObjectId(uid),
      submitDate: new Date(),
      riskAmount,
    })
    .then(({ ops }) => ops[0]);
}


export async function updatePullUpById(db, id, update) {
  // const _id = new ObjectId(`${id}`);
  console.log(id)
  return db
    .collection("pullups")
    .findOneAndUpdate({ _id: id }, { $set: update }, { returnOriginal: false })
    .then(({ value }) => value);
}