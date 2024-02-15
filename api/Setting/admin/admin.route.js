import express from 'express';
import * as adminController from './admin.controller.js';

const router = express.Router();

// all requests
router.get('/', adminController.ListRequests);

export default router;
