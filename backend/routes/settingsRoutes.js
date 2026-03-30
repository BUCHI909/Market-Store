import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  getFullProfile,
  updateProfileSettings,
  uploadAvatar,
  updatePassword,
  getStoreSettings,
  updateStoreSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getAppearanceSettings,
  updateAppearanceSettings,
  deleteAccount
} from "../controllers/settingsController.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile
router.get("/profile", getFullProfile);
router.put("/profile", updateProfileSettings);
router.post("/avatar", upload.single("avatar"), uploadAvatar);

// Password
router.put("/password", updatePassword);

// Store
router.get("/store", getStoreSettings);
router.put("/store", updateStoreSettings);

// Notifications
router.get("/notifications", getNotificationSettings);
router.put("/notifications", updateNotificationSettings);

// Appearance
router.get("/appearance", getAppearanceSettings);
router.put("/appearance", updateAppearanceSettings);

// Account
router.delete("/account", deleteAccount);

export default router;