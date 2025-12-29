export const adminOnly = (req, res, next) => {
  // Ensure req.user exists (set by auth middleware)
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admins Only" });
  }
  next();
};