import User from '../model/User.js';
import bcrypt from 'bcrypt';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, jobTitle, phoneNumber } = req.body;
    const userId = req.user._id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    if (jobTitle) user.jobTitle = jobTitle;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    
    // Save updated user
    const updatedUser = await user.save();
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
