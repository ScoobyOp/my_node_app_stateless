// fectching user details from db using the session id
// it is the custom middleware
import { eq } from "drizzle-orm";
import { db } from "../db/db_connection.js";
import { userTable } from "../model/user_schema.js";
import jwt from "jsonwebtoken"

export const fetchUserDetailsMiddleware = async (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  try {
    // first check tokenHeader , exist or not , because if it is exist then user is logged in
    if (!tokenHeader) {
      return next();
    }
    
    // Token should always start with Bearer <Token>, if it doesn't start like that, we need to throw error 
    if(!tokenHeader.startsWith("Bearer")){
      return res.status(400).json({error: "Token should start with bearer"})
    }
    // we are splitting the tokenHeader because it consist of Bearer + token`
    const token = tokenHeader.split(' ')[1]
    const user = jwt.verify(token, process.env.JWT_SECRET)

    req.user = user;
    //Important , we need return next here , otherwise the flow will not proceed further, it will
    // get stuck in the custom middlware itself,
    next();
  } catch (err) {
    next();
  }
};
