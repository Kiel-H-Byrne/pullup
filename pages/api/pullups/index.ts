import { getPullUps, insertPullUp } from "../../../db/index";
import { connectToDatabase } from "../../../db/mongodb";

const maxAge = 1 * 24 * 60 * 60;

const pullupHandler = async (req: any, res: any) => {
  const db = await connectToDatabase();

  const {
    //@ts-ignore
    //can send query params to sort & limit results
    query: { id, name, by, limit, from },
    method,
  } = req;
  switch (method) {
    case "GET":
      const pullups = await getPullUps(
        db,
        req.query.from ? req.query.from : undefined,
        req.query.by,
        req.query.limit ? parseInt(req.query.limit, 10) : 100
      );

      if (req.query.from && pullups.length > 0) {
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