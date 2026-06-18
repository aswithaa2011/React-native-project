export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};
