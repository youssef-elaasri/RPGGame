const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jws = require('jws');
const { TOKENSECRET } = process.env;

describe('User Routes', () => {
    const validPassword = 'StrongPassw0rd1*';
    const invalidPassword = 'weakpass';

    describe('POST /register', () => {
        it('should register a new user with valid data', async () => {
            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser', password: validPassword, email: 'test@example.com' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully and default game state set');
        });

        it('should not register a user with missing data', async () => {
            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('You must specify the username, the email, and the password.');
        });

        it('should not register a user with a weak password', async () => {
            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser', password: invalidPassword, email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Weak password!');
        });

        it('should not register a user with an existing username or email', async () => {
            await User.create({ username: 'testuser1', password_hash: await bcrypt.hash(validPassword, 10), email: 'test1@example.com' });

            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser1', password: validPassword, email: 'test1@example.com' });

            expect(response.status).toBe(409);
            expect(response.body.error).toBe('Username or email already exists.');
        });

        // Additional test for transaction rollback (error handling)
        it('should handle transaction rollback on registration failure', async () => {
            const mockUserCreate = jest.spyOn(User, 'create').mockImplementation(() => {
                throw new Error('Simulated failure');
            });

            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser2', password: validPassword, email: 'test2@example.com' });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error.');

            mockUserCreate.mockRestore();
        });
    });

    describe('POST /login', () => {
        beforeAll(async () => {
            await User.create({ username: 'loginuser', password_hash: await bcrypt.hash(validPassword, 10), email: 'login@example.com' });
        });

        it('should login a user with valid credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'loginuser', password: validPassword });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Authentication successful');
            expect(response.body.token).toBeDefined();
        });

        it('should not login a user with missing credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'loginuser' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Username and password must be provided.');
        });

        it('should not login a user with incorrect password', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'loginuser', password: 'wrongpassword' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Password is incorrect');
        });

        it('should not login a user that does not exist', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'nonexistent', password: validPassword });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('User not found');
        });
    });

    describe('POST /api/users/:userId/change-password', () => {
        let user, token;

        beforeAll(async () => {
            user = await User.create({ username: 'changepassworduser', password_hash: await bcrypt.hash(validPassword, 10), email: 'changepassword@example.com' });
            token = jws.sign({ header: { alg: 'HS256' }, payload: user.id, secret: TOKENSECRET });
        });

        it('should change password with valid data and authentication', async () => {
            const response = await request(app)
                .post(`/api/users/${user.id}/change-password`)
                .set('x-access-token', token)
                .send({ currentPassword: validPassword, newPassword: 'NewStr0ngP@ss' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password changed successfully.');
        });

        it('should not change password with missing data', async () => {
            const response = await request(app)
                .post(`/api/users/${user.id}/change-password`)
                .set('x-access-token', token)
                .send({ newPassword: 'NewStr0ngP@ss' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Both current and new passwords are required.');
        });

        it('should not change password with weak new password', async () => {
            const response = await request(app)
                .post(`/api/users/${user.id}/change-password`)
                .set('x-access-token', token)
                .send({ currentPassword: validPassword, newPassword: invalidPassword });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Weak new password!');
        });

        it('should not change password with incorrect current password', async () => {
            const response = await request(app)
                .post(`/api/users/${user.id}/change-password`)
                .set('x-access-token', token)
                .send({ currentPassword: 'wrongpassword', newPassword: 'NewStr0ngP@ss' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Current password is incorrect');
        });

        it('should not change password if not authenticated', async () => {
            const response = await request(app)
                .post(`/api/users/${user.id}/change-password`)
                .send({ currentPassword: validPassword, newPassword: 'NewStr0ngP@ss' });

            expect(response.status).toBe(403);
            expect(response.body.error).toBe('A token is required for authentication');
        });

        it('should handle non-existent user', async () => {
            const nonExistentUserId = 999;
            const nonExistentIdToken = jws.sign({ header: { alg: 'HS256' }, payload: nonExistentUserId, secret: TOKENSECRET });

            const response = await request(app)
                .post(`/api/users/${nonExistentUserId}/change-password`)
                .set('x-access-token', nonExistentIdToken)
                .send({ currentPassword: validPassword, newPassword: 'NewStr0ngP@ss' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found');
        });
    });

    describe('Middleware: verifyToken and userExists', () => {
        let user, token;

        beforeAll(async () => {
            user = await User.create({ username: 'middlewareuser', password_hash: await bcrypt.hash(validPassword, 10), email: 'middleware@example.com' });
            token = jws.sign({ header: { alg: 'HS256' }, payload: user.id, secret: TOKENSECRET });
        });

        it('should verify token and check user existence', async () => {
            const response = await request(app)
                .post(`/api/users/${user.id}/change-password`)
                .set('x-access-token', token)
                .send({ currentPassword: validPassword, newPassword: 'NewStr0ngP@ss' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password changed successfully.');
        });

        it('should not proceed without token', async () => {
            const response = await request(app)
                .post(`/api/users/${user.id}/change-password`)
                .send({ currentPassword: validPassword, newPassword: 'NewStr0ngP@ss' });

            expect(response.status).toBe(403);
            expect(response.body.error).toBe('A token is required for authentication');
        });

        it('should not proceed with invalid token', async () => {
            const response = await request(app)
                .post(`/api/users/${user.id}/change-password`)
                .set('x-access-token', 'invalidtoken')
                .send({ currentPassword: validPassword, newPassword: 'NewStr0ngP@ss' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Unauthorized: Invalid token');
        });

        it('should not proceed if user does not exist', async () => {
            const nonExistentUserId = 999;
            const nonExistentToken = jws.sign({ header: { alg: 'HS256' }, payload: nonExistentUserId, secret: TOKENSECRET });
            const response = await request(app)
                .post(`/api/users/${nonExistentUserId}/change-password`)
                .set('x-access-token', nonExistentToken)
                .send({ currentPassword: validPassword, newPassword: 'NewStr0ngP@ss' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found');
        });

        // Additional tests for error handling
        it('should handle token decoding failure', async () => {
            const invalidToken = jws.sign({ header: { alg: 'HS256' }, payload: null, secret: TOKENSECRET });
            const response = await request(app)
                .post(`/api/users/${user.id}/change-password`)
                .set('x-access-token', invalidToken)
                .send({ currentPassword: validPassword, newPassword: 'NewStr0ngP@ss' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Unauthorized: Token does not match user');
        });
    });
});
