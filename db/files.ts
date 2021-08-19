import mongodb, { Db, GridFSBucket, ObjectId } from "mongodb";
import { cursorTo } from "node:readline";
import fs from 'fs'
import { cachedBucket } from "./mongodb";
import assert from "node:assert";

export async function uploadFile(db: Db, blob: Blob) {
  
  // const bucket = new mongodb.GridFSBucket(db, {bucketName: 'pullupBucket'})
  console.log(`cachedBucket ${cachedBucket}`)
  try {
    cachedBucket.openUploadStream('file-name', {
      chunkSizeBytes: blob.size,
      metadata: { type: blob.type }
    }).
    on('error', function(error) {
      assert.ifError(error);
    }).
    on('finish', function() {
      console.log('done!');
    }).write(blob);
  } catch (error ) {
    console.warn('danger will rob')
    console.warn(error)
  }


}

export async function retrieveFile(bucket: GridFSBucket, fid: string) {
  let file;
  bucket.openDownloadStream(new ObjectId(fid)).
     pipe(file)
     return file


    //check if image
    if (file.contentType === 'image/jpeg' || file.contentType === "img/png") {
      //read output to browser
      const readStream = bucket.openDownloadStreamByName(file.filename)
      //.pipe(res)
      return {readStream}
    } else {
      return {
        err: "Not an image"
      }
    }
}