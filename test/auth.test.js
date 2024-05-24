const request = require('supertest');
const app = require('../app');
const { setupDatabase, tearDownDatabase, testUser } = require('./utils/testUtils');
const User = require('../models/User');

beforeEach(setupDatabase);
afterEach(tearDownDatabase);

describe('Auth API', () => {
    it('should signup a new user', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password'
            })
            .expect(201);

        const user = await User.findOne({ email: 'john@example.com' });
        expect(user).not.toBeNull();
        expect(response.body).toHaveProperty('message', 'User created successfully');
    });

    it('should login an existing user', async () => {
        await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            })
            .expect(200);
    });
});
