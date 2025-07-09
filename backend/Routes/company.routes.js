import express from 'express';
import {
    createCompany,
    getMyCompany,
    getCompanyById,
    updateCompany,
    listCompanies,
    deleteCompany,
    verifyCompany
} from '../Controllers/company.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Public routes
router.get('/', listCompanies); // List/search all companies
router.get('/:companyId', getCompanyById); // Get a specific company by ID

// Authenticated User (Employer) routes
router.post('/', protectRoute, checkRole('employer', 'admin'), createCompany); // Allow admin to create companies too
router.get('/my-company/details', protectRoute, checkRole('employer'), getMyCompany); // Specific route for employer to get their own company
router.put('/:companyId', protectRoute, checkRole('employer', 'admin'), updateCompany); // Employer updates their own, or Admin updates any

// Admin only routes
router.delete('/:companyId', protectRoute, checkRole('admin'), deleteCompany);
router.patch('/:companyId/verify', protectRoute, checkRole('admin'), verifyCompany);


export default router;
