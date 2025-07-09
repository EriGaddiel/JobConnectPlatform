import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { updateUserProfile, getUserProfile } from '../Controllers/user.controller.js';
// import { checkRole } from '../middleware/checkRole.js'; // If needed for admin routes later

const router = express.Router();

// Get user's own profile (already covered by /api/auth/me)
// router.get('/me', protectRoute, getMe); // This is in auth.routes.js

// Update user's own profile
router.put('/me', protectRoute, updateUserProfile); // Changed from POST to PUT, path to /me

// Get any user's public profile by ID
router.get('/:userId', getUserProfile); // No protectRoute by default, public profile. protectRoute can be added if only logged-in users can view profiles.

// Admin routes (example, to be implemented if needed)
// router.get('/', protectRoute, checkRole('admin'), listUsers);
// router.delete('/:userId', protectRoute, checkRole('admin'), deleteUser);

export default router;