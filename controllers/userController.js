import User from "../models/User.js";

// Create a new user
export const createUser = async (req, res) => {
    try {
      const { user_id, name, email, password, gender, age, subs_type } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists!" });
      }
  
      // Create a new user
      const newUser = new User({
        user_id,
        name,
        email,
        password, // This will be hashed automatically by the pre-save middleware
        gender,
        age,
        subs_type
      });
  
      await newUser.save();
  
      // Return user details without JWT token
      res.status(201).json({
        message: "User created successfully!",
        user: {
          user_id: newUser.user_id,
          name: newUser.name,
          email: newUser.email,
          gender: newUser.gender,
          age: newUser.age,
          subs_type: newUser.subs_type,
          signup_Date: newUser.signup_Date,
          password: newUser.password // This will be the hashed password
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.id }).select('-password');
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { user_id: req.params.id },
      req.body,
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: "User not found!" });
    res.status(200).json({ message: "User updated successfully!", user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ user_id: req.params.id });
    if (!deletedUser) return res.status(404).json({ message: "User not found!" });
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



