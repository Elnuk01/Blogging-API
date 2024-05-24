const mongoose = require('mongoose');
const User = require('../../models/User');
const Blog = require('../../models/Blog');

const testUser = {
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    password: 'password'
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Blog.deleteMany();
    const user = new User(testUser);
    await user.save();
};

const tearDownDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};

module.exports = {
    testUser,
    setupDatabase,
    tearDownDatabase
};
