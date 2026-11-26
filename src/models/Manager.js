
import mongoose from "mongoose";

const ManagerSchema = new mongoose.Schema(
  {
    
    // Basic Details

managerCode: {
  type: String,
  unique: true,
  sparse: true,
  trim: true,
},


    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    passwordHash: {
      type: String,
      default: null,
    },

    // Personal Details
    dateOfBirth: {
      type: Date,
      default: null,
    },

    maritalStatus: {
      type: String,
      default: "",
    },

    // Address Details
    permanentAddress: {
      type: String,
      default: "",
    },

    correspondenceAddress: {
      type: String,
      default: "",
    },

    // Professional Details
    qualification: {
      type: String,
      default: "",
    },

    otherQualification: {
      type: String,
      default: "",
    },

    workExperience: {
      type: String,
      default: "",
    },

    // GridFS File References

    // GridFS File References
    documents: {
      photo: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      aadhaar: [{
        type: mongoose.Schema.Types.ObjectId,
      }],

      pan: [{
        type: mongoose.Schema.Types.ObjectId,
      }],

      educationCertificates: [{
        type: mongoose.Schema.Types.ObjectId,
      }],

      experienceLetters: [{
        type: mongoose.Schema.Types.ObjectId,
      }],
    },


    // Branch Assignment
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },

branchId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Restaurant",
  default: null,
},

    // Owner Reference
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },



  
  {
    timestamps: true,
  }
);

const Manager =
  mongoose.models.Manager ||
  mongoose.model("Manager", ManagerSchema);

export default Manager;
