import pool from '../../../src/services/database';
import {
    Gender,
    getGenderById,
    getGenderByName,
    getAllGenders,
    deleteGenderById,
    updateGenderById,
    createGender
} from '../../../src/models/user/gender.model';

describe('Gender functions', () => {
    let testGender: Gender;

    beforeAll(async () => {
        const result = await pool.query(
            'INSERT INTO "Gender" ("GenderName") VALUES ($1) RETURNING *',
            ['Test Gender']
        );
        testGender = result.rows[0];
    });

    afterAll(async () => {
        await pool.query('DELETE FROM "Gender" WHERE "GenderID" = $1', [
            testGender.GenderID,
        ]);
    });

    describe('getGenderById', () => {
        it('should return the gender with the given ID', async () => {
            const gender = await getGenderById(testGender.GenderID);
            expect(gender).toEqual(testGender);
        });

        it('should return null if the gender does not exist', async () => {
            const gender = await getGenderById(-1);
            expect(gender).toBeNull();
        });
    });

    describe('getGenderByName', () => {
        it('should return the gender with the given name', async () => {
            const gender = await getGenderByName(testGender.GenderName);
            expect(gender).toEqual(testGender);
        });

        it('should return null if the gender does not exist', async () => {
            const gender = await getGenderByName('non-existent-gender-name');
            expect(gender).toBeNull();
        });
    });

    describe('getAllGenders', () => {
        it('should return all genders', async () => {
            const genders = await getAllGenders();
            expect(genders).toContainEqual(testGender);
        });
    });

    describe('updateGenderById', () => {
        it('should update the gender with the given ID', async () => {
            const updatedName = 'Updated Test Gender';
            const updatedTestGender = { ...testGender, GenderName: updatedName };
            const updatedResult = await updateGenderById(testGender.GenderID, updatedTestGender);

            expect(updatedResult?.GenderName).toEqual(updatedName);

            const retrievedUpdatedResult = await getGenderById(testGender.GenderID);
            expect(retrievedUpdatedResult?.GenderName).toEqual(updatedName);
        });

        it('should return null if the gender does not exist', async () => {
            const updatedResult = await updateGenderById(-1, { GenderName: 'Updated Test Gender' });
            expect(updatedResult).toBeNull();
        });
    });


    describe('deleteGenderById', () => {
        it('should delete the gender with the given ID', async () => {
            const result = await deleteGenderById(testGender.GenderID);
            expect(result).toBe(true);
            const gender = await getGenderById(testGender.GenderID);
            expect(gender).toBeNull();
        });

        it('should return false if the gender does not exist', async () => {
            const result = await deleteGenderById(-1);
            expect(result).toBe(false);
        });
    });


    describe('createGender', () => {
        it('should create a new gender', async () => {
            const gender = await createGender({
                GenderName: 'Test Gender'
            });
            expect(gender.GenderName).toEqual('Test Gender');
            await deleteGenderById(gender.GenderID);
        });
    });
});
