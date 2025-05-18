import Department from "../model/Department.js";

const addDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Department name is required'
      });
    }

    // Create new department
    const newDepartment = new Department({
      name,
      description
    });

    await newDepartment.save();

    return res.status(201).json({
      success: true,
      message: 'Department created successfully',
      department: newDepartment
    });
  } catch (error) {
    console.error('Error adding department:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    return res.status(200).json({
      success: true,
      department
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    return res.status(200).json({
      success: true,
      department
    });
  } catch (error) {
    console.error('Error updating department:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export { addDepartment, getAllDepartments, getDepartment, updateDepartment, deleteDepartment };