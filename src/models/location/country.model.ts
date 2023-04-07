import pool from '../../services/database';

interface Country {
    CountryID: number;
    CountryName: string;
}

async function getCountryById(countryId: number): Promise<Country | null> {
    const query = 'SELECT * FROM "Country" WHERE "CountryID"=$1;';
    const params = [countryId];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getCountryByName(countryName: String): Promise<Country | null> {
    const query = 'SELECT * FROM "Country" WHERE "CountryName"=$1;';
    const params = [countryName];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getAllCountries(): Promise<Country[]> {
    const query = 'SELECT * FROM "Country"';
    const result = await pool.query(query);
    return result.rows;
}

async function deleteCountryById(id: number): Promise<boolean> {
    const query = 'DELETE FROM "Country" WHERE "CountryID" = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

async function updateCountryById(id: number, country: Omit<Country, 'CountryID'>): Promise<Country | null> {
    const query = 'UPDATE "Country" SET "CountryName" = $1 WHERE "CountryID" = $2 RETURNING *';
    const values = [country.CountryName, id];
    const result = await pool.query(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function createCountry(country: Omit<Country, 'CountryID'>): Promise<Country> {
    const query = 'INSERT INTO "Country" ("CountryName") VALUES ($1) RETURNING *';
    const values = [country.CountryName];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export {
    Country,
    getCountryByName,
    getAllCountries,
    getCountryById,
    deleteCountryById,
    updateCountryById,
    createCountry
};