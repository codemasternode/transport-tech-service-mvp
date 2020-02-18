import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'

const CompanySchema = new mongoose.Schema(
  {
    logo: {
      type: String
    },
    nameOfCompany: {
      type: Schema.Types.String,
      required: [true, "the company name can not be empty"]
    },
    name: {
      type: Schema.Types.String,
      required: [true, "name can not be empty"],
      minlength: 2,
      maxlength: 50
    },
    surname: {
      type: Schema.Types.String,
      required: [true, "surname can not be empty"],
      minlength: 2,
      maxlength: 50
    },
    phone: {
      type: Schema.Types.String,
      required: true
    },
    taxNumber: {
      type: Schema.Types.String,
      required: [true, "unique tax number can not be empty"],
      minlength: 6,
      maxlength: 20,
      trim: true
    },
    isSuspended: {
      type: Schema.Types.Boolean,
      required: [true, "suspended can not be empty"],
      default: false
    },
    place: {
      type: Schema.Types.String,
      required: true
    },
    isVat: {
      type: Schema.Types.Boolean,
      required: true,
      default: true
    },
    email: {
      type: Schema.Types.String,
      required: [true, "email can not be empty"],
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: props => `${props.value} is not a valid email`
      },
      maxlength: 50,
      unique: true
    },
    plan: {
      vehicles: {
        type: Number,
        default: 5,
        required: true
      },
      companyBases: {
        type: Number,
        default: 1,
        required: true
      }
    },
    maxMonthUsage: {
      vehicles: {
        type: Number,
        required: true
      },
      companyBases: {
        type: Number,
        required: true
      }
    },
    password: {
      type: String,
      required: true
    },
    endDateSubscription: {
      type: Date,
      default: new Date(),
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updated_at: {
      type: Date,
      default: Date.now()
    },
    country: {
      type: String
    },
    countries: [
      {
        type: String
      }
    ],
    companyBases: {
      type: Array,
      default: []
    },
    isConfirmed: {
      type: Boolean,
      default: false
    },
    sumKmPerMonth: {
      type: Number,
      default: 0
    },
    sumCostsPerMonth: {
      type: Number,
      default: 0
    },
    statistics: [Date],
    confirmCode: {
      type: String,
      unique: true,
      required: true
    },
    freeUseToDate: {
      type: Date,
      default: new Date(new Date().getTime() + 1209600000),
      required: true
    },
    isFreeSpaceUsed: {
      type: Boolean,
      default: false,
      required: true
    },
    payments: [
      {
        payment_id: {
          unique: true,
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        isPaid: {
          type: Boolean,
          required: true,
          default: false
        },
        createdAt: {
          type: Date,
          required: true,
          default: new Date()
        }
      }
    ],
    dayToPay: {
      type: Date,
      required: true
    },
    isPaid: {
      type: Schema.Types.Boolean,
      default: false,
      required: true
    },
  },
  { strict: false }
);

CompanySchema.pre('save', function (next) {
  var company = this;
  company.updated_at = Date.now();
  if (company.isModified('password')) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(company.password, salt, function (err, hash) {
        if (err) return next(err);
        company.password = hash;
        next();
      });
    });
  }
});

CompanySchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

export default mongoose.model("company", CompanySchema);
