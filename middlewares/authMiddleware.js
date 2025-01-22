const authMiddleware = (req, res, next) => {
  const userToken = req.cookies.userToken;
  const user = {
    _id: userToken,
  };
  req.user = user;
  next();
};

export default authMiddleware;
