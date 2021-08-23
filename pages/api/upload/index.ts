import cloudinary from 'cloudinary';
import { NextApiRequest, NextApiResponse } from 'next';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // const data = await new Promise((resolve, reject) => {
  //   const form = new IncomingForm();

  //   form.parse(req, (err, fields, files) => {
  //     if (err) return reject(err);
  //     resolve({ fields, files });
  //   });
  // });

  console.log(req)
  const file = req.body.data;
  const response = await cloudinary.v2.uploader.upload(file, {
    resource_type: 'video',
    public_id: 'my_video',
  });
  return res.json(response);
};