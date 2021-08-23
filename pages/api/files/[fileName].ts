import cloudinary from 'cloudinary';
import { GridFSBucket, ObjectId } from "mongodb";
import { cachedBucket, connectToDatabase } from "../../../db";
import { uploadFile } from "../../../db/files";
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function fileHandler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const bucket = cachedBucket || new GridFSBucket(db);
  const {
    query: { fileName },
    method,
  } = req;
  switch (method) {
    case "GET":
      try {

        const file = await db.collection("uploads.files").findOne({ filename: fileName })
        if (!file || file.length === 0) {
          return res.status(404).json({ err: "Could not find file" });
        } else {
          console.log("1 API ", file) // gets printed out
          const readstream = fs.createReadStream(file.filename);
          readstream.pipe(res);
        }
      }
      catch (error) {
        res.status(400).json({ itemnotfound: "No image found" })
      }
      break
    case "POST":
      const blob = req.body as Blob
      try {
        if (!blob) throw Error('no object')
        bucket.openUploadStream(fileName as string, {
          chunkSizeBytes: blob.size,
          metadata: { type: blob.type }
        }).
          on('error', function (error) {
            res.send(error);
          }).
          on('finish', function () {
            console.log('done!');
          }).write(blob);
      } catch (error) {
        console.warn(error)
        res.send(error)
      }
      break
    case "PUT":
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      });
      try {
        const file = req.body.data;
        console.log("----------------file----------------------")
        const response = await cloudinary.v2.uploader.upload(String(file), {
          resource_type: 'video',
          public_id: 'my-video',
        }, (error, result) => {
          if (error) {
          console.warn("error in here")
          console.warn(error.code)
          // res.status(400).json(error)
          } else {
            console.log("yay")
            console.log(response)
          }
        })
        // res.send(response)
      } catch (error) {
        console.warn(error.code)
        // res.send(error)
      }
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

}