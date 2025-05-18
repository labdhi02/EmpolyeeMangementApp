import User from '../model/User.js';
import Employee from '../model/Employee.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Try to find admin user first
    let user = await User.findOne({ email });
    let isEmployee = false;

    // If not found in users, check employees
    if (!user) {
      user = await Employee.findOne({ email });
      isEmployee = true;
      console.log('Found employee account:', user ? 'Yes' : 'No');
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        role: isEmployee ? 'employee' : 'admin' 
      },
      process.env.JWT_SECRET,  // Make sure this matches
      { expiresIn: '1d' }
    );

    console.log('Login successful for:', {
      id: user._id,
      role: isEmployee ? 'employee' : 'admin',
      name: isEmployee ? `${user.firstName} ${user.lastName}` : user.name
    });

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: isEmployee ? `${user.firstName} ${user.lastName}` : user.name,
      email: user.email,
      role: isEmployee ? 'employee' : 'admin'
    };

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

const verify = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,      
            message: 'User verified',
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export { login, verify };
