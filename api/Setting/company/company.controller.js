import CompanyModel from './company.model.js';
import { validateCompany, validateUpdate } from './company.validator.js';

// Insert New company
export const insertCompany = async (req, res, next) => {
  try {
    // Validation
    const { error, value } = validateCompany(req.body);
    
    // Check Error in Validation
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if emailAddress already exists
    const existingCompanyName = await CompanyModel.findOne({ emailAddress: value.emailAddress });
    if (existingCompanyName) {
      return res.status(400).json({ error: 'Company with the given emailAddress already exists' });
    }
    
    // Insert company
    let companyModel = new CompanyModel(value);
    let savedCompany = await companyModel.save();

    // Send Response
    res.status(200).json({ message: 'Company data inserted', data: savedCompany });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting company data into the database' });
  }
};

// Display List
export const ListCompanys = async (req, res, next) => {
  try {
    let company = await CompanyModel.find({ disabled: false }).populate('userSponser_id');
    if (!company || company.length === 0) {
      console.log('companyr not found');
      return res.status(404).json({ message: 'company not found' });
    }
    res.status(200).json({ message: "success", company });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// Display Single company
export const showCompany = async (req, res, next) => {
  try {
    let companyId = req.params.id; // Assuming the parameter is companyId
    let company = await CompanyModel.findById(companyId).populate('userSponser_id')

    if (!company) {
      console.log('Company not found');
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving company' });
  }
};

// Update company
export const updateCompany = async (req, res, next) => {
  try {
    let companyId = req.params.id;

    // Validation
    let { error, value } = validateUpdate(req.body);

    // Check Error in Validation
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Find and update company based on sponserId
    let company = await CompanyModel.findByIdAndUpdate({ _id: companyId }, value, {
      new: true,
      runValidators: true // Ensure validation is applied on update
    });

    if (!company) {
      console.log('Company not found');
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating company' });
  }
};

// Delete company
export const deleteCompany = async (req, res, next) => {
  try {
    let companyId = req.params.id;

    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      { _id: companyId },
      { disabled: true },
      { new: true }
    );

    if (!updatedCompany) {
      console.log('Company not found');
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
