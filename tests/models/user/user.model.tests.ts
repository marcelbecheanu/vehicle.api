import pool from '../../../src/services/database';
import {
    User,
    getUserById,
    getUserByEmail,
    getAllUsers,
    deleteUserById,
    updateUserById,
    createUser
} from '../../../src/models/user/user.model';


import {
    Gender,
    createGender,
    deleteGenderById
} from '../../../src/models/user/gender.model';

describe('User model functions', () => {
    let testUser: User;
    let testGender: Gender;

    beforeAll(async () => {
        testGender = await createGender({
            GenderName: 'test gender - user model'
        });
        const result = await pool.query(
            'INSERT INTO "User" ("GenderID", "UserEmail", "UserFullName", "UserPassword", "UserBirthdate", "UserIsActive", "UserCreatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [testGender.GenderID, 'test@example.com', 'Test User', 'password', new Date(), true, new Date()]
        );
        testUser = result.rows[0];


    });

    afterAll(async () => {
        await pool.query('DELETE FROM "User" WHERE "UserID" = $1', [testUser.UserID]);
        await deleteGenderById(testGender.GenderID);
    });

    describe('getUserById', () => {
        it('should return the user with the given ID', async () => {
            const user = await getUserById(testUser.UserID);
            expect(user).toEqual(testUser);
        });

        it('should return null if the user does not exist', async () => {
            const user = await getUserById(-1);
            expect(user).toBeNull();
        });
    });

    describe('getUserByEmail', () => {
        it('should return the user with the given email', async () => {
            const user = await getUserByEmail(testUser.UserEmail);
            expect(user).toEqual(testUser);
        });

        it('should return null if the user does not exist', async () => {
            const user = await getUserByEmail('nonexistent@example.com');
            expect(user).toBeNull();
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = await getAllUsers();
            expect(users).toContainEqual(testUser);
        });
    });

    describe('updateUserById', () => {
        it('should update the user with the given ID', async () => {
            const updatedUserFullName = 'Updated Test User';
            const updatedUser = await updateUserById(testUser.UserID, {
                GenderID: testGender.GenderID,
                UserEmail: 'updated@example.com',
                UserFullName: updatedUserFullName,
                UserPassword: 'updatedpassword',
                UserBirthdate: new Date(),
                UserIsActive: false,
                UserCreatedAt: new Date(),
                UserModifiedAt: new Date()
            });
            expect(updatedUser).toEqual({ ...testUser, UserFullName: updatedUserFullName });
            const user = await getUserById(testUser.UserID);
            expect(user).toEqual({ ...testUser, UserFullName: updatedUserFullName });
        });

        it('should return null if the user does not exist', async () => {
            const updatedUser = await updateUserById(-1, {
                GenderID: testGender.GenderID,
                UserEmail: 'updated@example.com',
                UserFullName: 'Updated Non-existent User',
                UserPassword: 'updatedpassword',
                UserBirthdate: new Date(),
                UserIsActive: false,
                UserCreatedAt: new Date(),
                UserModifiedAt: null
            });
            expect(updatedUser).toBeNull();
        });
    });

    describe('deleteUserById', () => {
        it('should delete the user with the given ID', async () => {
            const result = await deleteUserById(testUser.UserID);
            expect(result).toBe(true);
            const user = await getUserById(testUser.UserID);
            expect(user).toBeNull();
        });

        it('should return false if the user does not exist', async () => {
            const result = await deleteUserById(-1);
            expect(result).toBe(false);
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const newUser = {
                GenderID: testGender.GenderID,
                UserEmail: 'newuser@example.com',
                UserFullName: 'New User',
                UserPassword: 'newpassword',
                UserBirthdate: new Date(),
                UserIsActive: true
            };
            const result = await createUser(newUser);
            expect(result.UserEmail).toBe(newUser.UserEmail);
            expect(result.UserFullName).toBe(newUser.UserFullName);
            expect(result.UserIsActive).toBe(newUser.UserIsActive);
            expect(result.UserID).toBeDefined();
            const user = await getUserById(result.UserID);
            expect(user).toEqual(result);
            await deleteUserById(result.UserID);
        });
    });
});