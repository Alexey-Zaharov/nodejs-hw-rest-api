const jwt = require("jsonwebtoken");
const { User } = require("../schemas");

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const [bearer, token] = req.headers.authorization.split(" ");
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token || bearer !== "Bearer") {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = auth;
