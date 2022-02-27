const express = require('express');
const expressAsyncHandler = require("express-async-handler");
const apiRouter = express.Router();

apiRouter.get(
    "/send",
    expressAsyncHandler(async (req, res) => {
      //await context.sendText('Welcome to Bottender');
      res.status(200).send({ message: "傳送" });
    })
  );

// apiRouter.post(
//   "/signin",
//   expressAsyncHandler(async (req, res) => {
//     const { userID, password } = req.body;
//     const user = await User.findOne({ userID });
//     if (user) {
//       if (bcrypt.compareSync(password, user.password)) {
//         res.send({
//           _id: user._id,
//           userID: user.userID,
//           email: user.email,
//           name: user.name,
//           userInterest: user.userInterest,
//           isAdmin: user.isAdmin,
//         });
//         return;
//       }
//     }
//     res.status(401).send({ message: "無此帳號或密碼錯誤" });
//   })
// );

module.exports = apiRouter;