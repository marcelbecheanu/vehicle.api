import pool from '../../../src/services/database';
import {
    ContactType,
    getContactTypeById,
    getContactTypeByName,
    getAllContactTypes,
    deleteContactTypeById
} from '../../../src/models/contact/contacttype.model';

describe('ContactType functions', () => {
    let testContactType: ContactType;

    beforeAll(async () => {
        const result = await pool.query(
            'INSERT INTO "ContactType" ("ContactTypeName", "ContactRegex") VALUES ($1, $2) RETURNING *',
            ['Test Contact Type', '^[0-9]{3}$']
        );
        testContactType = result.rows[0];
    });

    afterAll(async () => {
        await pool.query('DELETE FROM "ContactType" WHERE "ContactTypeID" = $1', [
            testContactType.ContactTypeID,
        ]);
    });

    describe('getContactTypeById', () => {
        it('should return the contact type with the given ID', async () => {
            const contactType = await getContactTypeById(testContactType.ContactTypeID);
            expect(contactType).toEqual(testContactType);
        });

        it('should return null if the contact type does not exist', async () => {
            const contactType = await getContactTypeById(-1);
            expect(contactType).toBeNull();
        });
    });

    describe('getContactTypeByName', () => {
        it('should return the contact type with the given name', async () => {
            const contactType = await getContactTypeByName(testContactType.ContactTypeName);
            expect(contactType).toEqual(testContactType);
        });

        it('should return null if the contact type does not exist', async () => {
            const contactType = await getContactTypeByName('non-existent-contact-type-name');
            expect(contactType).toBeNull();
        });
    });

    describe('getAllContactTypes', () => {
        it('should return all contact types', async () => {
            const contactTypes = await getAllContactTypes();
            expect(contactTypes).toContainEqual(testContactType);
        });
    });

    describe('deleteContactTypeById', () => {
        it('should delete the contact type with the given ID', async () => {
            const result = await deleteContactTypeById(testContactType.ContactTypeID);
            expect(result).toBe(true);
            const contactType = await getContactTypeById(testContactType.ContactTypeID);
            expect(contactType).toBeNull();
        });

        it('should return false if the contact type does not exist', async () => {
            const result = await deleteContactTypeById(-1);
            expect(result).toBe(false);
        });
    });
});