import pool from './../services/database';

interface District {
    DistrictID: number;
    CountryID: number;
    DistrictName: string;
}

async function getDistrictById(districtId: number): Promise<District | null> {
    const query = 'SELECT * FROM "District" WHERE "DistrictID"=$1;';
    const params = [districtId];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getDistrictByName(districtName: string): Promise<District | null> {
    const query = 'SELECT * FROM "District" WHERE "DistrictName"=$1;';
    const params = [districtName];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getAllDistricts(): Promise<District[]> {
    const query = 'SELECT * FROM "District"';
    const result = await pool.query(query);
    return result.rows;
}

async function deleteDistrictById(id: number): Promise<boolean> {
    const query = 'DELETE FROM "District" WHERE "DistrictID" = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

async function updateDistrictById(id: number, district: Omit<District, 'DistrictID'>): Promise<District | null> {
    const query = 'UPDATE "District" SET "DistrictName" = $1 WHERE "DistrictID" = $2 RETURNING *';
    const values = [district.DistrictName, id];
    const result = await pool.query(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function createDistrict(district: Omit<District, 'DistrictID'>): Promise<District> {
    const query = 'INSERT INTO "District" ("CountryID", "DistrictName") VALUES ($1, $2) RETURNING *';
    const values = [district.CountryID, district.DistrictName];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export {
    District,
    getDistrictByName,
    getAllDistricts,
    getDistrictById,
    deleteDistrictById,
    updateDistrictById,
    createDistrict
};