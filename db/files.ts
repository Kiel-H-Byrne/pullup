import mongodb, { Db } from "mongodb";
import { cachedBucket } from "./mongodb";

export async function uploadFile(db: Db, blob: Blob) {
  //naming convention, uid_location_timestamp
// const bucket = new mongodb.GridFSBucket(db, {bucketName: 'pullupBucket'})
console.log(`cachedBucket ${cachedBucket}`)
cachedBucket.openUploadStream('file-name', {
  chunkSizeBytes: blob.size,
  metadata: { type: blob.type }
})

return 'file id'

}

export async function retrieveFile(db:Db, fid: string) {

}