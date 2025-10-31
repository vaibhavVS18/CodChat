import { Router } from "express";
import passport from "passport";

const router = Router();

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     session: false,
//   })
// );

/*
->  in above code,(without using state)
Express would pass req, res, next to Passport automatically.
But since you want to grab req.query.state dynamically, you must write a wrapper route handler and then manually invoke the middleware with req, res, next.
*/
router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: req.query.state     // redirectPage passing in state
  })
  (req, res, next);  // <- second time , imp.(bcoz of state) ,  First part → create the middleware with your custom state value.  Second part → invoke it with the current request/response.
});



// router.get("/google/callback",
//     passport.authenticate("google", {failureRedirect: "/login"}),
//     (req, res)=>{
//         res.redirect(`${process.env.FRONTEND_URL}`);
//     }
// );


//    //  -> imp.- authenticate by jwt token
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     session: false,
//   }),
//   async (req, res) => {
//     // imp. - passport has saved user in req.user
//     console.log(req.user);

//     const token = req.user.generateJWT();

//     // Send token to frontend
//     res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
//   }
// );


//     //  ->  imp.- if also want to redirect on that page from which you had come
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    // console.log(req.user);

    const token = req.user.generateJWT();
    const redirectPage = req.query.state || "/";
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&redirectPage=${redirectPage}`);
  }
);






//       // -> no use of it bcoz we are not using session
// router.get("/logout", (req, res)=>{
//     req.logout(()=>{
//         res.redirect("/");
//     })
// });

export default router;
