import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // Not strictly required to support migrated users that have username instead
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Not strictly required to support migrated users that have password_hash
    },
    password_hash: {
      type: String,
    },
    department: {
      type: String,
      default: 'General',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Method to check password match
userSchema.methods.matchPassword = async function (enteredPassword) {
  const hash = this.password || this.password_hash;
  if (!hash) return false;
  return await bcrypt.compare(enteredPassword, hash);
};

// Pre-save middleware to hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
