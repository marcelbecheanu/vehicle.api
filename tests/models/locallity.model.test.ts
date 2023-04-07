import pool from '../../src/services/database';

import {
    Country,
    createCountry,
    deleteCountryById,
} from '../../src/models/country.model';

import {
    District,
    createDistrict,
    deleteDistrictById,
} from '../../src/models/district.model';

import {
    Locality,
    createLocality,
    deleteLocalityById,
    getAllLocalities,
    getLocalityById,
    getLocalityByName,
    updateLocalityById,
} from '../../src/models/locality.model';

describe('Locality functions', () => {
    let testCountry: Country;
    let testDistrict: District;
    let testLocality: Locality;

    beforeAll(async () => {
        testCountry = await createCountry({ CountryName: 'Test Country - Locality' });
        testDistrict = await createDistrict({ CountryID: testCountry.CountryID, DistrictName: 'Test District - Locality' });
        const result = await pool.query(
            'INSERT INTO "Locality" ("DistrictID", "LocalityName") VALUES ($1, $2) RETURNING *',
            [testDistrict.DistrictID, 'Test Locality']
        );
        testLocality = result.rows[0];
    });

    afterAll(async () => {
        await pool.query('DELETE FROM "Locality" WHERE "LocalityID" = $1', [
            testLocality.LocalityID,
        ]);
        await deleteDistrictById(testDistrict.DistrictID);
        await deleteCountryById(testCountry.CountryID);
    });

    describe('getLocalityByName', () => {
        it('should return the locality with the given name', async () => {
            const locality = await getLocalityByName('Test Locality');
            expect(locality).toEqual(testLocality);
        });

        it('should return null if the locality does not exist', async () => {
            const locality = await getLocalityByName('Non-existent Locality');
            expect(locality).toBeNull();
        });
    });

    describe('getAllLocalities', () => {
        it('should return all localities', async () => {
            const localities = await getAllLocalities();
            expect(localities).toContainEqual(testLocality);
        });
    });

    describe('getLocalityById', () => {
        it('should return the locality with the given ID', async () => {
            const locality = await getLocalityById(testLocality.LocalityID);
            expect(locality).toEqual(testLocality);
        });

        it('should return null if the locality does not exist', async () => {
            const locality = await getLocalityById(-1);
            expect(locality).toBeNull();
        });
    });

    describe('updateLocalityById', () => {
        it('should update the locality with the given ID', async () => {
            const updatedLocalityName = 'Updated Test Locality';
            const updatedLocality = await updateLocalityById(testLocality.LocalityID, { DistrictID: testDistrict.DistrictID, LocalityName: updatedLocalityName });
            expect(updatedLocality).toEqual({ ...testLocality, LocalityName: updatedLocalityName });
            const locality = await getLocalityById(testLocality.LocalityID);
            expect(locality).toEqual({ ...testLocality, LocalityName: updatedLocalityName });
        });

        it('should return null if the locality does not exist', async () => {
            const updatedLocality = await updateLocalityById(-1, { DistrictID: testDistrict.DistrictID, LocalityName: 'Updated Non-existent Locality' });
            expect(updatedLocality).toBeNull();
        });
    });

    describe('deleteLocalityById', () => {
        it('should delete the locality with the given ID', async () => {
            const result = await deleteLocalityById(testLocality.LocalityID);
            expect(result).toBe(true);
            const locality = await getLocalityById(testLocality.LocalityID);
            expect(locality).toBeNull();
        });

        it('should return false if the locality does not exist', async () => {
            const result = await deleteLocalityById(-1);
            expect(result).toBe(false);
        });
    });

    describe('createLocality', () => {
        it('should create a new Locality', async () => {
            const newLocality = { DistrictID: testDistrict.DistrictID, LocalityName: 'New Locality' };
            const result = await createLocality(newLocality);
            expect(result.LocalityName).toBe(newLocality.LocalityName);
            expect(result.DistrictID).toBe(testDistrict.DistrictID);
            expect(result.LocalityID).toBeDefined();
            const locality = await getLocalityById(result.LocalityID);
            expect(locality).toEqual(result);
            await deleteLocalityById(result.LocalityID);
        });
    });

});