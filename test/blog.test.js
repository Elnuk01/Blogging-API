const request = require('supertest');
const app = require('../app');
const { setupDatabase, tearDownDatabase, testUser } = require('./utils/testUtils');
const Blog = require('../models/Blog');
const User = require('../models/User');

let token;

beforeEach(async () => {
    await setupDatabase();
    const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: testUser.email,
            password: testUser.password
        });
    token = response.body.token;
});

afterEach(tearDownDatabase);

describe('Blog API', () => {
    it('should create a new blog', async () => {
        const response = await request(app)
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'My First Blog',
                description: 'This is the description of my first blog.',
                body: 'This is the body of my first blog.',
                tags: ['tag1', 'tag2']
            })
            .expect(201);

        const blog = await Blog.findOne({ title: 'My First Blog' });
        expect(blog).not.toBeNull();
        expect(response.body).toHaveProperty('message', 'Blog created successfully');
    });

    it('should get a list of published blogs', async () => {
        await request(app)
            .get('/api/blogs')
            .expect(200);
    });
});
