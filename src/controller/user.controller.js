import { eq } from "drizzle-orm";
import { db } from "../db/db_connection.js";
import { userTable } from "../model/user_schema.js";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken"

export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // we are checking the user is already exist or not
    // if exist's , we are informing user, about it, if not creating the user
    // we need to desturt from array, because it always return has a array from db
    const [userExists] = await db
      .select({
        email: userTable.email,
      })
      .from(userTable)
      .where(eq(userTable.email, email));

    if (userExists) {
      return res.status(400).json({
        msg: "Provided mail id has been taken already, please provide a unique one",
      });
    }
    // after user has provided a new mail id,
    // we have to save the user details in the db, before that we need to hash the password, because we should not store
    // plain password into the db
    // for hasing we need salt(random text) , that need's to be generated and stored in the db
    // then hashpassword we need to genrate, which is the combo of salt + plain password,
    // for hasing we are using lib from node ie node crypto, createHmacac for hasing, randomBytes for salt
    // we can keep random bytes upto 256, but i have kept 16

    // since it return's buffer we cannot store this as it is, we need to convert that to string hex
    const salt = randomBytes(256).toString("hex");

    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    // we need to desturt from array, because it always return has a array from db
    const [user] = await db
      .insert(userTable)
      .values({
        name,
        email,
        salt,
        password: hashedPassword,
      })
      .returning({ id: userTable.id });

    return res.status(201).json({
      msg: "User has been signed up succesfully",
      data: { id: user.id },
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // first check for email
    const [userExists] = await db
      .select({
        email: userTable.email,
        salt: userTable.salt,
        password: userTable.password,
        userId: userTable.id,
        name: userTable.name
      })
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!userExists) {
      return res
        .status(400)
        .json({ msg: "Please provide a valid email address" });
    }
    // second check for the password
    const salt = userExists.salt;
    const pwdfromdb = userExists.password;
    const hasedpassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    // second password check, include's comparison of incoming password hashed and password from db(already hashed and stored during signup)
    if (pwdfromdb !== hasedpassword) {
      return res.status(400).json({ msg: "Provided password is incorrect" });
    }

    // finaly , user login succesful, we have to create a token and share it to user , for further request the user can use this token
    // the token consist's of the user information + secrete for decoding

    const userInfo = {
     name: userExists.name,
     email: userExists.email,
     userId: userExists.userId
    }

    const token = jwt.sign(userInfo, process.env.JWT_SECRET)
    return res.status(201).json({ msg: "login succefull", token: token });
  } catch (err) {
    return res.status(400).json(err);
  }
};

// Clearing token from the server side is not possible , because it is shared to end user, one thing we can do is, we can add expiry during the jwt signing.
// Since session doesnt play major role in the statless authentication, so we are commenting the below code.
// export const logoutUser = async (req, res) => {
//   const sessionId = req.headers["session-id"];
//   // instead we can also fetch the session-id from cookies if it available, once the user has logged in.
//   try {
//     if (!sessionId) {
//       return res.status(401).json("You are not logged in, please login");
//     }
//     await db.delete(userSessionTable).where(eq(userSessionTable.id, sessionId));
//     return res.status(200).json({ msg: "you have been succefully logged out" });
//   } catch (err) {
//     return res.status(400).json(err);
//   }
// };

export const fetchUserDetailsAfterLogin = async (req, res) => {
  // Here, req.user will give the complete user details , which is achieved with the help
  // custom middleware function fetchUserDetailsFromDB
  const user = req.user;
  if (!user) {
    return res.status(401).json("You are not logged in, please login");
  }
  return res.status(200).json({ data: user });
};

export const updateUserDetails = async (req, res) => {
  const { name } = req.body;
  // Here, req.user will give the complete user details , which is achieved with the help of
  // custom middleware function fetchUserDetailsFromDB
  const user = req.user;
  try {
    if (!user) {
      return res.status(401).json("You are not logged in, please login");
    }
    await db
      .update(userTable)
      .set({ name })
      .where(eq(userTable.id, user.userId));
    return res.json({ msg: "success" });
  } catch (err) {
    return res.status(400).json(err);
  }
};
