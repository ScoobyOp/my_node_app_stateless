import express from "express"
import { fetchUserDetailsAfterLogin, loginUser, signupUser, updateUserDetails } from "../controller/user.controller.js"
import { fetchUserDetailsMiddleware } from "../middleware/fetchUserDetailsFromDb.js"

const router = express.Router()
// Health route to check the status of the api
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP"
    });
});
// here custom middleware function is added to the routes, get and patch  "/", where it give user details 
// first custom middlware runs from there next runs the controller function 
// for eg, first runs fetchUserDetailsMiddleware and then finally runs fetchUserDetailsAfterLogin fun controler/handler
router.get("/",fetchUserDetailsMiddleware , fetchUserDetailsAfterLogin)
router.patch("/", fetchUserDetailsMiddleware, updateUserDetails)
router.post("/signup", signupUser)
router.post("/login", loginUser)
// router.post("/logout", logoutUser)



export default router