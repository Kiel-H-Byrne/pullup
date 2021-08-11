import { GridFSBucket, ObjectId } from "mongodb";
import { cachedBucket, connectToDatabase } from "../../../db";
import { uploadFile } from "../../../db/files";

export default async function fileHandler(req: any, res: any){
  const db = await connectToDatabase();
  const bucket = cachedBucket || new GridFSBucket(db);
  const {
    query: { fileName },
    method,
  } = req;
  switch (method) {
    case "GET":
        bucket.openDownloadStreamByName(fileName).on("error",( error => {
          res.status(404).send(error)

        })).
          pipe(res)
      break
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

}