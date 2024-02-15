import express from 'express';
import * as userController from './user.controller.js';

const router = express.Router();

// Add user
router.post('/', userController.userInsert);

// All users
router.get('/', userController.showAllUsers);

// Show user
router.get('/:sponserId', userController.showUser);

// Show user from sponsorId
router.get('/fromSponsorId/:sponserId', userController.showUserFromSponsorId);

// Update user
router.put('/:sponserId', userController.updateUser);

// Delete user
router.delete('/:sponserId', userController.deleteUser);

export default router;
