import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: { 
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    googleId: { 
      type: String,
      unique: true,
      sparse: true 
    },
     careerProfile: {
      type: {
        industry: String,
        currentRole: String,
        desiredRole: String,
        skills: [String],
      },
      required: false,
     }
    }, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;