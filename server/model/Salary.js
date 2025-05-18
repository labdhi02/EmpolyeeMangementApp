import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  allowances: {
    hra: {
      type: Number,
      default: 0
    },
    da: {
      type: Number,
      default: 0
    },
    medical: {
      type: Number,
      default: 0
    },
    ta: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  deductions: {
    pf: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    insurance: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  netSalary: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'paid'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to calculate totals
salarySchema.pre('save', function(next) {
  // Calculate allowances total
  this.allowances.total = 
    this.allowances.hra +
    this.allowances.da +
    this.allowances.medical +
    this.allowances.ta;

  // Calculate deductions total
  this.deductions.total = 
    this.deductions.pf +
    this.deductions.tax +
    this.deductions.insurance;

  // Calculate net salary
  this.netSalary = this.basicSalary + this.allowances.total - this.deductions.total;

  next();
});

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;
