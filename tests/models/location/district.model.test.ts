import pool from '../../../src/services/database';

import {
    District,
    getDistrictByName,
    getAllDistricts,
    getDistrictById,
    deleteDistrictById,
    updateDistrictById,
    createDistrict
} from '../../../src/models/location/district.model';

import {
    Country,
    createCountry,
    deleteCountryById
} from '../../../src/models/location/country.model';


describe('District functions', () => {
    let testDistrict: District;
    let testCountry: Country;

    beforeAll(async () => {
        testCountry = await createCountry({ CountryName: "Test Country - District" });
        const result = await pool.query(
            'INSERT INTO "District" ("CountryID", "DistrictName") VALUES ($1, $2) RETURNING *',
            [testCountry.CountryID, 'Test District']
        );
        testDistrict = result.rows[0];
    });

    afterAll(async () => {
        await pool.query('DELETE FROM "District" WHERE "DistrictID" = $1', [
            testDistrict.DistrictID,
        ]);
        await deleteCountryById(testCountry.CountryID);
    });

    describe('getDistrictByName', () => {
        it('should return the district with the given name', async () => {
            const district = await getDistrictByName('Test District');
            expect(district).toEqual(testDistrict);
        });

        it('should return null if the district does not exist', async () => {
            const district = await getDistrictByName('Non-existent District');
            expect(district).toBeNull();
        });
    });

    describe('getAllDistricts', () => {
        it('should return all districts', async () => {
            const districts = await getAllDistricts();
            expect(districts).toContainEqual(testDistrict);
        });
    });

    describe('getDistrictById', () => {
        it('should return the district with the given ID', async () => {
            const district = await getDistrictById(testDistrict.DistrictID);
            expect(district).toEqual(testDistrict);
        });

        it('should return null if the district does not exist', async () => {
            const district = await getDistrictById(-1);
            expect(district).toBeNull();
        });
    });

    describe('updateDistrictById', () => {
        it('should update the district with the given ID', async () => {
            const updatedDistrictName = 'Updated Test District';
            const updatedDistrict = await updateDistrictById(testDistrict.DistrictID, { CountryID: testCountry.CountryID, DistrictName: updatedDistrictName });
            expect(updatedDistrict).toEqual({ ...testDistrict, DistrictName: updatedDistrictName });
            const district = await getDistrictById(testDistrict.DistrictID);
            expect(district).toEqual({ ...testDistrict, DistrictName: updatedDistrictName });
        });

        it('should return null if the district does not exist', async () => {
            const updatedDistrict = await updateDistrictById(-1, { CountryID: testCountry.CountryID, DistrictName: 'Updated Non-existent District' });
            expect(updatedDistrict).toBeNull();
        });
    });

    describe('deleteDistrictById', () => {
        it('should delete the district with the given ID', async () => {
            const result = await deleteDistrictById(testDistrict.DistrictID);
            expect(result).toBe(true);
            const district = await getDistrictById(testDistrict.DistrictID);
            expect(district).toBeNull();
        });

        it('should return false if the district does not exist', async () => {
            const result = await deleteDistrictById(-1);
            expect(result).toBe(false);
        });
    });

    describe('createDistrict', () => {
        it('should create a new District', async () => {
            const newDistrict = { CountryID: testCountry.CountryID, DistrictName: 'New District' };
            const result = await createDistrict(newDistrict);
            expect(result.DistrictName).toBe(newDistrict.DistrictName);
            expect(result.CountryID).toBe(testCountry.CountryID);
            expect(result.DistrictID).toBeDefined();
            const district = await getDistrictById(result.DistrictID);
            expect(district).toEqual(result);
            await deleteDistrictById(result.DistrictID);
        });
    });

});