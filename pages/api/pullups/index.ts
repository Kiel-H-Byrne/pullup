import { getPullUps, getPullupsNearBy, insertPullUp } from "../../../db/index";
import { connectToDatabase } from "../../../db/mongodb";

const maxAge = 1 * 24 * 60 * 60;

const pullupHandler = async (req: any, res: any) => {
  const db = await connectToDatabase();
  db.createIndex("pullups", { location: "2dsphere" });

  const {
    //@ts-ignore
    //can send query params to sort & limit results
    query: { by, limit, lat, lng },
    method,
  } = req;
  switch (method) {
    case "GET":
      console.log(typeof lat, typeof lng)
      const pullups =
        lat && lng
          ? await getPullupsNearBy(
              db,
              lat && lng
                ? { lat: Number(lat), lng: Number(lng) }
                : { lat: 0, lng: 0 },
              by,
              limit ? parseInt(limit, 10) : 100
            )
          : await getPullUps(db);
      if (lat && lng && pullups.length > 0) {
        // This is safe to cache because from defines
        //  a concrete range of pullups
        res.setHeader("cache-control", `public, max-age=${maxAge}`);
      }
      res.send({ pullups });
      break;
    case "POST":
      // if (!req.user) {
        //   return res.status(401).send('unauthenticated');
        // }

        if (!req.body)
          return res.status(400).send("You must write something");
        
        const pullup = await insertPullUp(db, req.body.data);
        return res.json({ pullup });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

// handler.post(async (req: Request | any, res: Response | any) => {
//
// });

export default pullupHandler;