import UserModel from "./user.model.js";
import { validateUser, validateUpdate } from "./user.validator.js";
import bcrypt from 'bcrypt';

function generateSponsorId(count) {
  // Assuming count is a number like 1, 2, 3, ...
  const formattedCount = count.toString().padStart(2, '0');
  return `USE-${formattedCount}`;
}

// Create User
export async function userInsert(req, res, next) {
  try {
    // Validation
    let { error, value } = validateUser(req.body);

    // Check Error in Validation
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if emailAddress already exists
    const existingUser = await UserModel.findOne({ emailAddress: value.emailAddress });
    if (existingUser) {
      return res.status(400).json({ error: 'User with the given emailAddress already exists' });
    }

    // Hash the Password
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    // Replace the plain password with the hashed one
    value.password = hashedPassword;

    // Generate sponsorId
    const count = await UserModel.countDocuments() + 1; // Get the count of existing documents
    const sponsorId = generateSponsorId(count);

    // Insert User with sponsorId
    value.sponsorId = sponsorId; // Fix the typo here, should be "sponsorId" instead of "sponserId"
    value.fromSponsorId = req.body.fromSponsorId; // Assign fromSponsorId from request body

    let userModel = new UserModel(value);
    let savedUser = await userModel.save();

    // Update company with userSponsor_id
    const companyId = req.body.company_id; // Assuming you pass company_id in the request body
    if (companyId) {
      // Create a filter object using the companyId
      const filter = { _id: companyId };

      // Push the user's sponsorId into the userSponsor_id array of the company
      // await CompanyModel.findOneAndUpdate(filter, { $push: { userSponsor_id: savedUser.sponsorId } });
    }

    // Send Response
    res.status(200).json({ message: 'User data inserted', data: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting user data into the database' });
  }
}

// User List
export async function showAllUsers(req, res) {
  try {
    const user = await UserModel.find({ disabled: "false" });
    console.log(user);

    if (!user || user.length === 0) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// Display Single User
export async function showUser(req, res, next) {
  try {
    const sponserId = req.params.sponserId; // Corrected variable name
    console.log(sponserId);
    const user = await UserModel.findOne({ sponsorId: sponserId }); // Corrected field name
    console.log(user);

    if (!user) {
      console.log("---NOT---");
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}


// Display the User of fromSponsorId and sponsorId
export async function showUserFromSponsorId(req, res, next) {
  try {
    const searchedSponsorId = req.params.sponserId; // Assuming the parameter is sponsorId

    // Function to recursively find all connected sponsor IDs
    const findAllConnectedSponsors = async (searchedId, visited = new Set()) => {
      visited.add(searchedId);

      // Find connections where the searchedSponsorId is fromSponsorId
      const connections = await UserModel.find({ fromSponsorId: searchedId });

      if (!connections || connections.length === 0) {
        return [];
      }

      let connectedSponsorIds = connections.map(connection => connection.sponsorId);

      // Recursively find all connected sponsor IDs for each connected sponsor ID
      for (const connectedSponsorId of connectedSponsorIds) {
        if (!visited.has(connectedSponsorId)) {
          const nestedConnections = await findAllConnectedSponsors(connectedSponsorId, visited);
          connectedSponsorIds = connectedSponsorIds.concat(nestedConnections);
        }
      }

      return connectedSponsorIds;
    };

    // Find all connected sponsor IDs recursively
    const allConnectedSponsorIds = await findAllConnectedSponsors(searchedSponsorId);

    // Retrieve details of the searched sponsor ID
    const searchedSponsor = await UserModel.findOne({ sponsorId: searchedSponsorId });

    // Retrieve details of all connected sponsor IDs from the UserModel
    const allConnectedSponsorDetails = await UserModel.find({ sponsorId: { $in: allConnectedSponsorIds } });

    // Construct response object including the searchedSponsorId and all connectedSponsorIds with details
    const response = {
      searchedSponsor: searchedSponsor,
      allConnectedSponsorDetails: allConnectedSponsorDetails
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}

// Update User
export async function updateUser(req, res, next) {
  try {
    const sponsorId = req.params.sponserId;

    // Validation
    const { error, value } = validateUpdate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    // Get the existing user by ID using Mongoose
    const existingUser = await UserModel.findOneAndUpdate(
      { sponsorId: sponsorId },
      value,
      { new: true }
    );
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Object.assign(existingUser, userData);
    // const updatedUser = await existingUser.save();
    
    // Send the updated user as JSON response
    res.status(200).json({  message: 'success', user: existingUser });
  } catch (error) {
    // Send Error Response
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// Delete User
export async function deleteUser(req, res, next) {
  try {
    const sponserId = req.params.sponsorId;
    const updatedUser = await UserModel.findOneAndUpdate(
      { sponserId: sponserId },
      { disabled: "true" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}
