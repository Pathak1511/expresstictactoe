const AppError = require("./../utils/newAppError");
const catchAsync = require("./../utils/catchAsync");
const Player = require("./../model/playerModel");

exports.login = catchAsync(async (req, res, next) => {
  const PlayerData = req.body;

  const query = await Player.find({ userName: req.body.userName });
  let email = query[0].email;
  if (query.length === 1) {
    //console.log(query[0].password === PlayerData.password.toString());
    if (query[0].password === PlayerData.password.toString()) {
      const query2 = await Player.findOneAndUpdate(
        { userName: PlayerData.userName },
        {
          $set: { session: true },
        }
      );
      const query = await Player.find({ email: email });

      res.cookie(req.body.userName + "=" + req.body.password);
      res.status(200).json({
        status: "success",
        data: query,
        message: "Login Successfully",
      });
    }
  } else {
    return next(new AppError("User does not exist, Sign up", 400));
  }
});

exports.protected = catchAsync(async (req, res, next) => {
  let token = req.headers;
  let userName = "",
    password = "",
    index;
  if (token.cookie) {
    index = token.cookie.indexOf("=");
    for (let i = 0; i < token.cookie.length; i++) {
      if (i < index) userName += token.cookie[i];
      if (i > index) password += token.cookie[i];
    }
    password = password.split("=")[0];
  }

  const query = await Player.find({ userName: userName });
  if (query[0].password === password) {
    next();
  } else {
    next(new AppError("unauthorized", 401));
  }
});

exports.logout = catchAsync(async (req, res, next) => {
  let token = req.headers;
  let key = token.cookie.split("=")[0];
  res.clearCookie(key);
  res.status(200).json({
    status: "success",
    message: "logout successfully",
  });
});
