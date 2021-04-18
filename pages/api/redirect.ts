import { ObjectID} from "mongodb";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from './_connector'

export default async(req: VercelRequest, res: VercelResponse) => {
  const db = await connectToDatabase();
  const entry = await db.db('links_db').collection('links_collection').findOne({_id: new ObjectID(req.query.id as string)});
  
  if(entry){
    return res.redirect(301, entry.link)
  }
  
  return res.redirect(301,'/');
};
