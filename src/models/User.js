const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 40 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false, minlength: 8 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { transform: (_doc, ret) => { delete ret.password; delete ret.__v; return ret; } } });

userSchema.pre('save', async function hashPassword() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.verifyPassword = function verifyPassword(candidate) { return bcrypt.compare(candidate, this.password); };

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
