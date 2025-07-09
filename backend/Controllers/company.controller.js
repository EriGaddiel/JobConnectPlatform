import Company from "../Models/company.model.js";
import User from "../Models/user.model.js"; // To associate company with user

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private (Employer)
export const createCompany = async (req, res) => {
    try {
        const { name, description, website, industry, companySize, location, contactEmail, contactPhone, logo, foundedYear, socialLinks } = req.body;
        const userId = req.user._id;

        if (!name || !description) {
            return res.status(400).json({ error: "Company name and description are required." });
        }

        // Check if user already has a company or is associated with one
        const existingUserCompany = await Company.findOne({ $or: [{ createdBy: userId }, { admins: userId }] });
        if (existingUserCompany) {
            return res.status(400).json({ error: "You are already associated with a company. You can manage it or contact support if this is an error." });
        }

        // Check if company name is unique
        const existingCompany = await Company.findOne({ name });
        if (existingCompany) {
            return res.status(400).json({ error: "A company with this name already exists." });
        }

        const company = new Company({
            name,
            description,
            website,
            industry,
            companySize,
            location,
            contactEmail,
            contactPhone,
            logo,
            foundedYear,
            socialLinks,
            createdBy: userId,
            admins: [userId] // Creator is an admin by default
        });

        const savedCompany = await company.save();

        // Update user's document to link to this company
        await User.findByIdAndUpdate(userId, { company: savedCompany._id });

        res.status(201).json(savedCompany);

    } catch (error) {
        console.error("Error creating company:", error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get company for the authenticated employer
// @route   GET /api/companies/my-company
// @access  Private (Employer)
export const getMyCompany = async (req, res) => {
    try {
        const userId = req.user._id;
        // Find company where user is creator or an admin
        const company = await Company.findOne({ $or: [{ createdBy: userId }, { admins: userId }] })
                                     .populate("createdBy", "fullName email")
                                     .populate("admins", "fullName email");

        if (!company) {
            return res.status(404).json({ error: "No company profile found for your account. Please create one." });
        }
        res.status(200).json(company);
    } catch (error) {
        console.error("Error fetching employer's company:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


// @desc    Get a single company by ID (Public)
// @route   GET /api/companies/:companyId
// @access  Public
export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.companyId)
                                     .populate("createdBy", "fullName email profilePicture") // Populate some creator info
                                     // .populate("jobs"); // TODO: Add virtual populate for jobs later
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        res.status(200).json(company);
    } catch (error) {
        console.error("Error fetching company by ID:", error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: "Company not found (invalid ID format)" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Update a company profile
// @route   PUT /api/companies/:companyId (or /my-company)
// @access  Private (Employer who owns/administers the company, or Admin role)
export const updateCompany = async (req, res) => {
    try {
        const userId = req.user._id;
        const companyId = req.params.companyId; // Assuming route is /api/companies/:companyId

        // Find the company and verify user's permission
        // User must be createdBy or in admins list OR user must be an 'admin' role
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ error: "Company not found." });
        }

        const isOwnerOrAdmin = company.createdBy.equals(userId) || company.admins.some(adminId => adminId.equals(userId));

        if (!isOwnerOrAdmin && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Not authorized to update this company." });
        }

        // Fields that can be updated
        const { name, description, website, industry, companySize, location, contactEmail, contactPhone, logo, foundedYear, socialLinks } = req.body;

        if (name && name !== company.name) { // If name changes, check for uniqueness
            const existingCompany = await Company.findOne({ name });
            if (existingCompany && existingCompany._id.toString() !== companyId) {
                 return res.status(400).json({ error: "Another company with this name already exists." });
            }
            company.name = name;
        }

        if (description !== undefined) company.description = description;
        if (website !== undefined) company.website = website;
        if (industry !== undefined) company.industry = industry;
        if (companySize !== undefined) company.companySize = companySize;
        if (location !== undefined) company.location = location;
        if (contactEmail !== undefined) company.contactEmail = contactEmail;
        if (contactPhone !== undefined) company.contactPhone = contactPhone;
        if (logo !== undefined) company.logo = logo;
        if (foundedYear !== undefined) company.foundedYear = foundedYear;
        if (socialLinks !== undefined) company.socialLinks = socialLinks;
        // Add/remove admins logic can be a separate endpoint for clarity

        const updatedCompany = await company.save();
        res.status(200).json(updatedCompany);

    } catch (error) {
        console.error("Error updating company:", error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        if (error.code === 11000) { // Duplicate key error for name
            return res.status(400).json({ error: "A company with this name already exists." });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};


// @desc    List/Search companies (Public)
// @route   GET /api/companies
// @access  Public
export const listCompanies = async (req, res) => {
    try {
        const { search, industry, location, size, page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) {
            query.$text = { $search: search }; // Uses the text index
        }
        if (industry) {
            query.industry = { $regex: industry, $options: 'i' }; // Case-insensitive regex search
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (size) {
            query.companySize = size; // Assuming exact match for size category
        }

        const sortOptions = {};
        let projection = {};

        if (search) {
            sortOptions.score = { $meta: "textScore" };
            projection.score = { $meta: "textScore" };
            // Default secondary sort if only search is provided
            if (!req.query.sortBy) sortOptions.createdAt = -1;
            else sortOptions[req.query.sortBy] = req.query.sortOrder === 'asc' ? 1 : -1;

        } else if (req.query.sortBy) {
            sortOptions[req.query.sortBy] = req.query.sortOrder === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1; // Default sort
        }

        const companies = await Company.find(query, projection)
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select("-admins -createdBy -contactEmail -contactPhone"); // Exclude more fields for public listing

        const totalCompanies = await Company.countDocuments(query);

        res.status(200).json({
            companies,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCompanies / parseInt(limit)),
            totalCompanies
        });

    } catch (error) {
        console.error("Error listing companies:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};


// @desc    Delete a company (Admin only, or owner under specific conditions - simplify to Admin for now)
// @route   DELETE /api/companies/:companyId
// @access  Private (Admin)
export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ error: "Company not found." });
        }

        // TODO: Add more robust checks: e.g., cannot delete if active jobs, or reassign jobs.
        // For now, simple deletion by Admin.

        await User.updateMany({ company: companyId }, { $unset: { company: "" } }); // Unlink users
        // await Job.deleteMany({ company: companyId }); // Delete associated jobs - handle carefully

        await company.deleteOne(); // Using deleteOne instance method

        res.status(200).json({ message: "Company deleted successfully." });

    } catch (error) {
        console.error("Error deleting company:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Verify a company (Admin only)
// @route   PATCH /api/companies/:companyId/verify
// @access  Private (Admin)
export const verifyCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const { isVerified } = req.body; // Expecting { isVerified: true/false }

        if (typeof isVerified !== 'boolean') {
            return res.status(400).json({ error: "isVerified field must be a boolean." });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ error: "Company not found." });
        }

        company.isVerified = isVerified;
        await company.save();

        res.status(200).json({ message: `Company verification status set to ${isVerified}.`, company });
    } catch (error) {
        console.error("Error verifying company:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
