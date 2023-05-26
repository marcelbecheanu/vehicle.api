import pool from '../../services/database';

interface User {
    UserID: number;
    GenderID: number;
    UserEmail: string;
    UserFullName: string;
    UserPassword: string;
    UserBirthdate: Date;
    UserIsActive: boolean;
    UserCreatedAt: Date;
    UserModifiedAt: Date | null;
}

async function getUserById(userId: number): Promise<User | null> {
    const query = 'SELECT * FROM "User" WHERE "UserID" = $1;';
    const params = [userId];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getUserByEmail(userEmail: string): Promise<User | null> {
    const query = 'SELECT * FROM "User" WHERE "UserEmail" = $1;';
    const params = [userEmail];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getAllUsers(): Promise<User[]> {
    const query = 'SELECT * FROM "User"';
    const result = await pool.query(query);
    return result.rows;
}

async function deleteUserById(userId: number): Promise<boolean> {
    const query = 'DELETE FROM "User" WHERE "UserID" = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

async function updateUserById(userId: number, user: Omit<User, 'UserID'>): Promise<User | null> {
    const query =
        'UPDATE "User" SET "GenderID" = $1, "UserEmail" = $2, "UserFullName" = $3, "UserPassword" = $4, "UserBirthdate" = $5, "UserIsActive" = $6, "UserModifiedAt" = $7 WHERE "UserID" = $8 RETURNING *';
    const values = [
        user.GenderID,
        user.UserEmail,
        user.UserFullName,
        user.UserPassword,
        user.UserBirthdate,
        user.UserIsActive,
        new Date(),
        userId
    ];
    const result = await pool.query(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function createUser(user: Omit<User, 'UserID' | 'UserCreatedAt' | 'UserModifiedAt'>): Promise<User> {
    const query =
        'INSERT INTO "User" ("GenderID", "UserEmail", "UserFullName", "UserPassword", "UserBirthdate", "UserIsActive", "UserCreatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [
        user.GenderID,
        user.UserEmail,
        user.UserFullName,
        user.UserPassword,
        user.UserBirthdate,
        user.UserIsActive || false,
        new Date()
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export {
    User,
    getUserById,
    getUserByEmail,
    getAllUsers,
    deleteUserById,
    updateUserById,
    createUser
};
