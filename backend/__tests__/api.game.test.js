const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const SavePoint = require('../models/savePoint');
const LobbySave = require('../models/lobbySave');
const Map = require('../models/map');
const CompletedStage = require('../models/completedStage');
const bcrypt = require('bcrypt');
const jws = require('jws');
const { TOKENSECRET } = process.env;

describe('Game Controllers', () => {
    let testUser, testMap, token;
    const validPassword = 'StrongPassw0rd1*';

    // Before all tests, set up the necessary test data
    beforeAll(async () => {
        try {
            testUser = await User.create({
                username: 'gameuser',
                password_hash: await bcrypt.hash(validPassword, 10),
                email: 'game@example.com'
            });
            token = jws.sign({ header: { alg: 'HS256' }, payload: testUser.id, secret: TOKENSECRET });
            testMap = await Map.create({ map_name: 'testmap' });
        } catch (error) {
            console.error('Error setting up test data:', error);
        }
    });

    describe('loadGame', () => {
        // Test loading a game for a user with a save point
        it('should load game for a user with save point', async () => {
            await SavePoint.create({
                userId: testUser.id,
                mapId: testMap.id,
                player_x: 10,
                player_y: 20
            });

            const response = await request(app)
                .get(`/api/users/${testUser.id}/load`)
                .set('x-access-token', token);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                mapName: 'testmap',
                playerX: 10,
                playerY: 20,
                completedStages: []
            });
        });

        // Test handling a user not found scenario
        it('should return 404 if user not found', async () => {
            const nonExistentIdToken = jws.sign({ header: { alg: 'HS256' }, payload: 999, secret: TOKENSECRET });

            const response = await request(app)
                .get('/api/users/999/load')
                .set('x-access-token', nonExistentIdToken);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found');
        });

        // Test handling no save point found for the user
        it('should return 404 if no save point found for the user', async () => {
            newUser = await User.create({
                username: 'newUser',
                password_hash: await bcrypt.hash(validPassword, 10),
                email: 'newUser@example.com'
            });
            newToken = jws.sign({ header: { alg: 'HS256' }, payload: newUser.id, secret: TOKENSECRET });
            const response = await request(app)
                .get(`/api/users/${newUser.id}/load`)
                .set('x-access-token', newToken);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('No save point found for the user');
        });
    });

    describe('saveGame', () => {
        // Test creating a new save point
        it('should create a new save point if none exists', async () => {
            const response = await request(app)
                .post(`/api/users/${testUser.id}/save`)
                .set('x-access-token', token)
                .send({ mapName: 'testmap', player_x: 30, player_y: 40 });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Save point created successfully');

            const savePoint = await SavePoint.findOne({ where: { userId: testUser.id } });
            expect(savePoint).toBeDefined();
            expect(savePoint.player_x).toBe(30);
            expect(savePoint.player_y).toBe(40);
            expect(savePoint.mapId).toBe(testMap.id);
        });

        // Test updating an existing save point
        it('should update an existing save point', async () => {
            await SavePoint.create({
                userId: testUser.id,
                mapId: testMap.id,
                player_x: 10,
                player_y: 20
            });

            const response = await request(app)
                .post(`/api/users/${testUser.id}/save`)
                .set('x-access-token', token)
                .send({ mapName: 'testmap', player_x: 30, player_y: 40 });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Save point created successfully');

            const updatedSavePoint = await SavePoint.findOne({ where: { userId: testUser.id } });
            expect(updatedSavePoint.player_x).toBe(30);
            expect(updatedSavePoint.player_y).toBe(40);
        });

        // Test creating completed stages if provided
        it('should create completed stages if provided', async () => {
            const response = await request(app)
                .post(`/api/users/${testUser.id}/save`)
                .set('x-access-token', token)
                .send({ mapName: 'testmap', player_x: 30, player_y: 40, completedStages: ['stage1', 'stage2'] });

            expect(response.status).toBe(201);

            const completedStages = await CompletedStage.findAll({ where: { userId: testUser.id } });
            expect(completedStages.length).toBe(2);
            expect(completedStages.map(stage => stage.flag)).toContain('stage1');
            expect(completedStages.map(stage => stage.flag)).toContain('stage2');
        });

        // Test handling missing required fields
        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post(`/api/users/${testUser.id}/save`)
                .set('x-access-token', token)
                .send({ player_x: 30, player_y: 40 });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Missing required fields: mapName, player_x, player_y');
        });

        // Test handling map not found scenario
        it('should return 404 if map not found', async () => {
            const response = await request(app)
                .post(`/api/users/${testUser.id}/save`)
                .set('x-access-token', token)
                .send({ mapName: 'nonexistentmap', player_x: 30, player_y: 40 });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Map not found');
        });
    });

    describe('lobbySave', () => {
        // Test creating a new lobby save
        it('should create a new lobby save if none exists', async () => {
            const response = await request(app)
                .post(`/api/users/${testUser.id}/saveLobby`)
                .set('x-access-token', token)
                .send({ mapName: 'testmap' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Lobby saved successfully');

            const lobbySave = await LobbySave.findOne({ where: { userId: testUser.id } });
            expect(lobbySave).toBeDefined();
            expect(lobbySave.mapId).toBe(testMap.id);
        });

        // Test updating an existing lobby save
        it('should update an existing lobby save', async () => {
            const existingLobbySave = await LobbySave.create({
                userId: testUser.id,
                mapId: testMap.id
            });

            const response = await request(app)
                .post(`/api/users/${testUser.id}/saveLobby`)
                .set('x-access-token', token)
                .send({ mapName: 'testmap' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Lobby saved successfully');

            const updatedLobbySave = await LobbySave.findOne({ where: { id: existingLobbySave.id } });
            expect(updatedLobbySave.mapId).toBe(testMap.id);
        });

        // Test handling map not found scenario
        it('should return 404 if map not found', async () => {
            const response = await request(app)
                .post(`/api/users/${testUser.id}/saveLobby`)
                .set('x-access-token', token)
                .send({ mapName: 'nonexistentmap' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Map not found');
        });
    });

    describe('lobbyLoad', () => {
        // Test loading the lobby save for a user
        it('should load the lobby save for a user', async () => {
            await LobbySave.create({
                userId: testUser.id,
                mapId: testMap.id
            });

            const response = await request(app)
                .get(`/api/users/${testUser.id}/loadLobby`)
                .set('x-access-token', token);

            expect(response.status).toBe(200);
            expect(response.body).toBe('testmap');
        });

        // Test handling errors when retrieving lobby save
        it('should handle errors when retrieving lobby save', async () => {
            const findByPkStub = jest.spyOn(User, 'findByPk').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get(`/api/users/${testUser.id}/loadLobby`)
                .set('x-access-token', token);

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error');

            findByPkStub.mockRestore();
        });
    });
});
