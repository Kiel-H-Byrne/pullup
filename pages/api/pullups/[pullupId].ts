import { getPullUps, insertPullUp } from "../../../db/index";
import { connectToDatabase } from "../../../db/mongodb";
import { MAX_AGE } from '../../../util/constants';


export default async (req: any, res: any) => {
  const db = await connectToDatabase();
  const {
    //@ts-ignore
    //can send query params to sort & limit results
    query: { id, name, oid, limit, from },
    method,
  } = req;
  // console.log(req.query)
  switch (method) {
    case "GET":
      const comments = await getComments(
        db,
        req.query.from ? new Date(req.query.from) : undefined,
        req.query.oid,
        req.query.limit ? parseInt(req.query.limit, 10) : undefined
      );

      if (req.query.from && comments.length > 0) {
        // This is safe to cache because from defines
        //  a concrete range of comments
        res.setHeader("cache-control", `public, max-age=${MAX_AGE}`);
      }

      res.send({ comments });
      break;
    case "POST":
      // if (!req.user) {
        //   return res.status(401).send('unauthenticated');
        // }
        // console.log(req.body.data)
        if (!req.body)
          return res.status(400).send("You must write something");
        const comment = await insertComment(db, req.body.data);
        return res.json({ comment });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};