import pool from '../../services/database';

interface Gender {
    GenderID: number;
    GenderName: string;
}

async function getGenderById(genderId: number): Promise<Gender | null> {
    const query = 'SELECT * FROM "Gender" WHERE "GenderID"=$1;';
    const params = [genderId];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getGenderByName(genderName: string): Promise<Gender | null> {
    const query = 'SELECT * FROM "Gender" WHERE "GenderName"=$1;';
    const params = [genderName];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getAllGenders(): Promise<Gender[]> {
    const query = 'SELECT * FROM "Gender"';
    const result = await pool.query(query);
    return result.rows;
}

async function deleteGenderById(id: number): Promise<boolean> {
    const query = 'DELETE FROM "Gender" WHERE "GenderID" = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

async function updateGenderById(id: number, gender: Omit<Gender, 'GenderID'>): Promise<Gender | null> {
    const query = 'UPDATE "Gender" SET "GenderName" = $1 WHERE "GenderID" = $2 RETURNING *';
    const values = [gender.GenderName, id];
    const result = await pool.query(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function createGender(gender: Omit<Gender, 'GenderID'>): Promise<Gender> {
    const query = 'INSERT INTO "Gender" ("GenderName") VALUES ($1) RETURNING *';
    const values = [gender.GenderName];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export {
    Gender,
    getGenderByName,
    getAllGenders,
    getGenderById,
    deleteGenderById,
    updateGenderById,
    createGender
};
