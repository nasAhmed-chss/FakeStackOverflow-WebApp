const request = require('supertest');
const app = require('../server');

describe('User Creation', () => {
    it('should create a new user and return 201 status', async () => {
        const response = await request(app).post('/post/users/register').send({
            firstName: 'newuser',
            lastName: 'newguy',
            username: 'newuser@example.com',
            password: 'password123'
        });
        expect(response.status).toBe(201);
    });

    it('should return 400 status for missing fields', async () => {
        const response = await request(app).post('/post/users/register').send({
            username: 'incompleteuser',
        });
        expect(response.status).toBe(400);
    });
});
