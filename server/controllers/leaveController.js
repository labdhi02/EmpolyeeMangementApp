import Leave from '../model/Leave.js';

// Fetch all leaves for the logged-in user (only their leaves)
export const getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leaves',
    });
  }
};

// Add a new leave request (set employee field)
export const addLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, leaveType } = req.body;

    // Validate required fields
    if (!fromDate || !toDate || !reason || !leaveType) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const newLeave = new Leave({
      employee: req.user._id,
      fromDate,
      toDate,
      reason,
      leaveType,
      status: 'pending',
    });

    const savedLeave = await newLeave.save();

    return res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      leave: savedLeave,
    });
  } catch (error) {
    console.error('Error adding leave:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit leave request',
    });
  }
};

// Fetch all leave requests (Admin view)
export const getAllLeaves = async (req, res) => {
  try {
    console.log('Getting all leaves...');
    const leaves = await Leave.find().sort({ createdAt: -1 }); // Fetch all leaves
    console.log('Found leaves:', leaves.length);

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error('Error in getAllLeaves:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leaves',
    });
  }
};

// Update leave status (Admin action)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Leave status updated to ${status}`,
      leave
    });
  } catch (error) {
    console.error('Error updating leave status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update leave status'
    });
  }
};
