// Schema for users

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: {
        type: String,
        required: true,
        unique: true, // ensures no two users can have the same email
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // regex to validate email
    },
    password: { type: String, required: true },
    reputation: { type: Number, default: 100 },
    isAdmin: { type: Boolean, default: false },
    joinedDate: { type: Date, default: Date.now },
});

// Function to hash password before saving
const hashPassword = async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        return next();
    } catch (error) {
        return next(error);
    }
};

// Pre-save middleware hook
userSchema.pre('save', hashPassword);

userSchema.virtual('url')
    .get(function () {
        return 'posts/users/' + this._id;
    });

module.exports = mongoose.model('User', userSchema);
