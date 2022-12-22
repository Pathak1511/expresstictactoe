const AppError = require("./../utils/newAppError");
const catchAsync = require("./../utils/catchAsync");
const Player = require("./../model/playerModel");

exports.getPlayedByMeResult = catchAsync(async (req, res, next) => {
  const data = await Player.find();
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.postByX = catchAsync(async (req, res, next) => {
  const myEmail = req.body.myEmail;
  const otherEmail = req.body.otherEmail;
  let newArray = req.body.data;
  const query = await Player.find({ email: myEmail });

  let len = query[0].PlayedByme.length;
  let newObject;
  for (let i = 0; i < len; i++) {
    if (query[0].PlayedByme[i][0].email === otherEmail) {
      newObject = query[0].PlayedByme[i][0];
    }
  }

  let object = [
    {
      email: otherEmail,
      data: newArray,
      win: req.body.win,
      lose: req.body.lose,
      draw: req.body.draw,
    },
  ];

  const result = await Player.updateOne(
    { email: myEmail },
    {
      $pull: { PlayedByme: [newObject] },
    }
  );
  const result2 = await Player.updateOne(
    { email: myEmail },
    {
      $addToSet: { PlayedByme: object },
    }
  );
  res.status(200).json({
    status: "success",
    result,
    result2,
  });
});

exports.postByO = catchAsync(async (req, res, next) => {
  const myEmail = req.body.myEmail;
  const otherEmail = req.body.otherEmail;
  let newArray = req.body.data;
  const query = await Player.find({ email: otherEmail });

  let len = query[0].PlayedByme.length;
  let newObject;
  for (let i = 0; i < len; i++) {
    if (query[0].PlayedByme[i][0].email === myEmail) {
      newObject = query[0].PlayedByme[i][0];
    }
  }

  let object = [
    {
      email: myEmail,
      data: newArray,
      win: req.body.win,
      lose: req.body.lose,
      draw: req.body.draw,
    },
  ];

  const result = await Player.updateOne(
    { email: otherEmail },
    {
      $pull: { PlayedByme: [newObject] },
    }
  );

  const result2 = await Player.updateOne(
    { email: otherEmail },
    {
      $addToSet: { PlayedByme: object },
    }
  );

  res.status(200).json({
    status: "success",
    result,
    result2,
  });
});

// Not required
exports.getPlayedByOther = catchAsync(async (req, res, next) => {
  const data = [{ player3: [0, 1, 0] }, { player4: [0, 1, 1] }];

  res.status(200).json({
    status: "success",
    data,
  });
});

const Validate = function (v) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
};

// Create Acc
exports.createPlayerAccount = catchAsync(async (req, res, next) => {
  let statusCode, status, message;
  if (!Validate(req.body.email)) {
    return next(new AppError("Invalid Email ID", 401));
  } else {
    const player = await Player.create(req.body);
    res.status(200).json({
      status: "success",
      data: player,
      message: "Congrations !!! Accounts created.",
    });
  }
});

// sending connection request same as friend request
exports.sendRequestToOther = catchAsync(async (req, res, next) => {
  const data = req.body;
  console.log(data);
  const myEmail = data.emailMine;
  const otherEmail = data.emailOther;

  let addArray = [
    {
      email: otherEmail,
      data: "0000000001",
      win: 0,
      lost: 0,
      draw: 0,
    },
  ];

  const query = await Player.findOneAndUpdate(
    { email: myEmail },
    {
      $addToSet: { PlayedByme: addArray },
    }
  );

  const otherQuery = await Player.findOneAndUpdate(
    { email: otherEmail },
    {
      $push: { AcceptRequest: myEmail },
    }
  );

  res.status(200).json({
    status: "success",
    query,
    otherQuery,
  });
});

// accepting request send by other
exports.acceptedSendRequest = catchAsync(async (req, res, next) => {
  const data = req.body;
  const email = data.myEmail;
  const otherEmail = data.otherEmail;
  let object = [
    {
      email: email,
      data: "0000000001",
      win: 0,
      lost: 0,
      draw: 0,
    },
  ];
  let addArray = [
    {
      email: email,
      data: "0000000000",
      win: 0,
      lost: 0,
      draw: 0,
    },
  ];

  const query = await Player.findOneAndUpdate(
    { email: otherEmail },
    {
      $pull: { PlayedByme: object },
    }
  );

  const query2 = await Player.findOneAndUpdate(
    { email: otherEmail },
    {
      $addToSet: { PlayedByme: addArray },
    }
  );

  res.status(200).json({
    status: "success",
    query,
  });
});

// Ending Game
exports.endGame = catchAsync(async (req, res, next) => {
  const data = req.body;
  const email = data.myEmail;
  const otherEmail = data.otherEmail;

  let addArray = {
    email: otherEmail,
    data: "0000000",
    win: 0,
    lost: 0,
    draw: 0,
  };

  res.status(200).json({
    status: "success",
  });
});
