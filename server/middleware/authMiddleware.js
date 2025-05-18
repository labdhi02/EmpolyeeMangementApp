import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import Employee from '../model/Employee.js';

export const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            let user;

            if (decoded.role === 'admin') {
                user = await User.findById(decoded.id).select('-password');
            } else {
                user = await Employee.findById(decoded.id).select('-password');
            }
            
            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            req.user = { 
                _id: user._id,
                ...user._doc, 
                role: decoded.role 
            };
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export default verifyUser;