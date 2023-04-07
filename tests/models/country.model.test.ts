import pool from '../../src/services/database';

import {
    Country,
    getCountryByName,
    getAllCountries,
    getCountryById,
    deleteCountryById,
    updateCountryById,
    createCountry
} from '../../src/models/country.model';


describe('Country functions', () => {
    let testCountry: Country;

    beforeAll(async () => {
        const result = await pool.query(
            'INSERT INTO "Country" ("CountryName") VALUES ($1) RETURNING *',
            ['Test Country']
        );
        testCountry = result.rows[0];
    });

    afterAll(async () => {
        await pool.query('DELETE FROM "Country" WHERE "CountryID" = $1', [
            testCountry.CountryID,
        ]);
    });

    describe('getCountryByName', () => {
        it('should return the country with the given name', async () => {
            const country = await getCountryByName('Test Country');
            expect(country).toEqual(testCountry);
        });

        it('should return null if the country does not exist', async () => {
            const country = await getCountryByName('Non-existent Country');
            expect(country).toBeNull();
        });
    });

    describe('getAllCountries', () => {
        it('should return all countries', async () => {
            const countries = await getAllCountries();
            expect(countries).toContainEqual(testCountry);
        });
    });

    describe('getCountryById', () => {
        it('should return the country with the given ID', async () => {
            const country = await getCountryById(testCountry.CountryID);
            expect(country).toEqual(testCountry);
        });

        it('should return null if the country does not exist', async () => {
            const country = await getCountryById(-1);
            expect(country).toBeNull();
        });
    });

    describe('updateCountryById', () => {
        it('should update the country with the given ID', async () => {
            const updatedCountryName = 'Updated Test Country';
            const updatedCountry = await updateCountryById(testCountry.CountryID, { CountryName: updatedCountryName });
            expect(updatedCountry).toEqual({ ...testCountry, CountryName: updatedCountryName });
            const country = await getCountryById(testCountry.CountryID);
            expect(country).toEqual({ ...testCountry, CountryName: updatedCountryName });
        });

        it('should return null if the country does not exist', async () => {
            const updatedCountry = await updateCountryById(-1, { CountryName: 'Updated Non-existent Country' });
            expect(updatedCountry).toBeNull();
        });
    });


    describe('deleteCountryById', () => {
        it('should delete the country with the given ID', async () => {
            const result = await deleteCountryById(testCountry.CountryID);
            expect(result).toBe(true);
            const country = await getCountryById(testCountry.CountryID);
            expect(country).toBeNull();
        });

        it('should return false if the country does not exist', async () => {
            const result = await deleteCountryById(-1);
            expect(result).toBe(false);
        });
    });

    describe('createCountry', () => {
        it('should create a new country', async () => {
            const newCountry = { CountryName: 'New Country' };
            const result = await createCountry(newCountry);
            expect(result.CountryName).toBe(newCountry.CountryName);
            expect(result.CountryID).toBeDefined();
            const country = await getCountryById(result.CountryID);
            expect(country).toEqual(result);
            await deleteCountryById(result.CountryID);
        });
    });
});