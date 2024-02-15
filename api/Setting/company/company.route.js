import express from 'express';
import * as companyController from './company.controller.js';
// const connectionController = require('./connection.controller');

const router = express.Router();

// add company
router.post('/', companyController.insertCompany);

// all companys
router.get('/', companyController.ListCompanys);

/* show */
router.get('/:id', companyController.showCompany);

/* update */
router.put('/:id', companyController.updateCompany);

/* Delete */
router.delete('/:id', companyController.deleteCompany);

export default router;
