import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

// test protected route
router.get("/", auth, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user
  });
});

export default router;