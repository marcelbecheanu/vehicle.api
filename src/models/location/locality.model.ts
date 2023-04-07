import pool from '../../services/database';

interface Locality {
    LocalityID: number;
    DistrictID: number;
    LocalityName: string;
}

async function getLocalityById(localityId: number): Promise<Locality | null> {
    const query = 'SELECT * FROM "Locality" WHERE "LocalityID"=$1;';
    const params = [localityId];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getLocalityByName(localityName: string): Promise<Locality | null> {
    const query = 'SELECT * FROM "Locality" WHERE "LocalityName"=$1;';
    const params = [localityName];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getAllLocalities(): Promise<Locality[]> {
    const query = 'SELECT * FROM "Locality"';
    const result = await pool.query(query);
    return result.rows;
}

async function deleteLocalityById(id: number): Promise<boolean> {
    const query = 'DELETE FROM "Locality" WHERE "LocalityID" = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

async function updateLocalityById(id: number, locality: Omit<Locality, 'LocalityID'>): Promise<Locality | null> {
    const query = 'UPDATE "Locality" SET "DistrictID" = $1, "LocalityName" = $2 WHERE "LocalityID" = $3 RETURNING *';
    const values = [locality.DistrictID, locality.LocalityName, id];
    const result = await pool.query(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function createLocality(locality: Omit<Locality, 'LocalityID'>): Promise<Locality> {
    const query = 'INSERT INTO "Locality" ("DistrictID", "LocalityName") VALUES ($1, $2) RETURNING *';
    const values = [locality.DistrictID, locality.LocalityName];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export {
    Locality,
    getLocalityByName,
    getAllLocalities,
    getLocalityById,
    deleteLocalityById,
    updateLocalityById,
    createLocality
};