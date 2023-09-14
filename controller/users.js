// const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const users = require("../service");
const Joi = require("joi");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const schema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

const bcrypt = require("bcrypt");
const saltRounds = 10;

const addUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validData = schema.validate({ password: password, email: email });

    if (validData.error) {
      return res.status(400).json({
        message: "Validation error",
        data: validData.error,
      });
    }

    const user = await users.getUser(req.body);
    if (user) {
      return res.status(409).json({
        code: 409,
        message: "Email in use",
        data: {
          message: "Email in use",
        },
      });
    }

    const hash = await bcrypt.hash(password, saltRounds).then(function (hash) {
      return hash;
    });
    const newUser = await users.addUser({
      ...req.body,
      password: hash,
      avatarURL: gravatar.url(email, { s: "100", r: "x", d: "retro" }, false),
    });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: gravatar.url(
          newUser.email,
          { s: "100", r: "x", d: "retro" },
          false
        ),
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const logInUser = async (req, res, next) => {
  const { email, password } = req.body;
  const validData = schema.validate({ password: password, email: email });
  if (validData.error) {
    return res.status(400).json({
      message: "Validation error",
      data: validData.error,
    });
  }

  try {
    const user = await users.getUser(req.body);

    if (!user) {
      return res.status(401).json({
        message: "Email or password is wrong. Or not registred.",
      });
    }

    await bcrypt
      .compare(password, user.password)
      .then(function (result) {
        if (result) {
          const token = jwt.sign(
            { id: user._id.toString() },
            process.env.SECRET_KEY,
            {
              expiresIn: "1d",
            }
          );
          users.updateUser(user._id, { token });
          res.status(200).json({
            user: {
              email: user.email,
              subscription: user.subscription,
              token,
            },
          });
        } else {
          res.status(401).json({ message: "Wrong password" });
        }
      })
      .catch((e) => {
        next(e);
      });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const logOutUser = async (req, res, next) => {
  try {
    const [_, token] = req.headers.authorization.split(" ");
    const { id } = jwt.decode(token, process.env.SECRET_KEY);
    const user = await users.getUserById(id);
    if (user) {
      users.updateUser(user._id, { token: null });
      res.status(204).json();
      return;
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const currUser = async (req, res, next) => {
  try {
    const [_, token] = req.headers.authorization.split(" ");
    const user = await users.getCurrUser(token);
    user ? res.status(200).json({ user }) : next(e);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const updateUserAvatar = async (req, res) => {
  const [_, token] = req.headers.authorization.split(" ");
  const { id } = jwt.decode(token, process.env.SECRET_KEY);
  const user = await users.getUserById(id);
  Jimp.read(user.avatarURL)
    .then((img) => {
      img.resize(250, 250).write("./temp/avatar." + img.getExtension());
    })
    .catch((e) => console.log(e));
  const { path: tempUpload, originalname } = req.file;
  const filename = `${id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await users.updateUser(id, { avatarURL });
  res.status(200).json({
    avatarURL,
  });
};

module.exports = {
  addUser,
  logInUser,
  logOutUser,
  currUser,
  updateUserAvatar,
};
