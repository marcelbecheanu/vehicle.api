import pool from '../../services/database';

interface ContactType {
    ContactTypeID: number;
    ContactTypeName: string;
    ContactRegex: string;
}

async function getContactTypeById(contactTypeId: number): Promise<ContactType | null> {
    const query = 'SELECT * FROM "ContactType" WHERE "ContactTypeID"=$1;';
    const params = [contactTypeId];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getContactTypeByName(contactTypeName: string): Promise<ContactType | null> {
    const query = 'SELECT * FROM "ContactType" WHERE "ContactTypeName"=$1;';
    const params = [contactTypeName];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getAllContactTypes(): Promise<ContactType[]> {
    const query = 'SELECT * FROM "ContactType"';
    const result = await pool.query(query);
    return result.rows;
}

async function deleteContactTypeById(id: number): Promise<boolean> {
    const query = 'DELETE FROM "ContactType" WHERE "ContactTypeID" = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

async function updateContactTypeById(id: number, contactType: Omit<ContactType, 'ContactTypeID'>): Promise<ContactType | null> {
    const query = 'UPDATE "ContactType" SET "ContactTypeName" = $1, "ContactRegex" = $2 WHERE "ContactTypeID" = $3 RETURNING *';
    const values = [contactType.ContactTypeName, contactType.ContactRegex, id];
    const result = await pool.query(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function createContactType(contactType: Omit<ContactType, 'ContactTypeID'>): Promise<ContactType> {
    const query = 'INSERT INTO "ContactType" ("ContactTypeName", "ContactRegex") VALUES ($1, $2) RETURNING *';
    const values = [contactType.ContactTypeName, contactType.ContactRegex];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export {
    ContactType,
    getContactTypeByName,
    getAllContactTypes,
    getContactTypeById,
    deleteContactTypeById,
    updateContactTypeById,
    createContactType
};