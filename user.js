import mongoose from 'mongoose';

// Prevent "model overwrite" or re-declaration issue in watch/debug mode
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Use existing model if it exists (important for hot-reloading or debugging)
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
