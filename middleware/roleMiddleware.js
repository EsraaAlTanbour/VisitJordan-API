export const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};

export const providerOnly = (req, res, next) => {
  if (req.user.role !== "Provider") {
    return res.status(403).json({
      message: "Provider access only",
    });
  }

  next();
};

export const userOnly = (req, res, next) => {
  if (req.user.role !== "User") {
    return res.status(403).json({
      message: "User access only",
    });
  }

  next();
};