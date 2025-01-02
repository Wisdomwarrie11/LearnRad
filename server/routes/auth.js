import express from "express";
import { registerStudent } from "../controllers/authController.js";

const router = express.Router();

// Student Registration Route
router.post("/register-student", registerStudent);

// Email Verification Route
router.get("/verify-email/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      user.isVerified = true;
      await user.save();
  
      res.send("Email verified! You can now log in.");
    } catch (error) {
      res.status(500).send("Server error");
    }
  });
  

export default router;
