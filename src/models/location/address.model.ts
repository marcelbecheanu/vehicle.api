import pool from '../../services/database';

interface Address {
    AddressID: number;
    LocalityID: number;
    AddressName: string;
    AddressPostalCode: string;
}

async function getAddressById(addressId: number): Promise<Address | null> {
    const query = 'SELECT * FROM "Address" WHERE "AddressID"=$1;';
    const params = [addressId];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getAddressByName(addressName: string): Promise<Address | null> {
    const query = 'SELECT * FROM "Address" WHERE "AddressName"=$1;';
    const params = [addressName];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getAllAddresses(): Promise<Address[]> {
    const query = 'SELECT * FROM "Address"';
    const result = await pool.query(query);
    return result.rows;
}

async function deleteAddressById(id: number): Promise<boolean> {
    const query = 'DELETE FROM "Address" WHERE "AddressID" = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

async function updateAddressById(id: number, address: Omit<Address, 'AddressID'>): Promise<Address | null> {
    const query = 'UPDATE "Address" SET "LocalityID" = $1, "AddressName" = $2, "AddressPostalCode" = $3 WHERE "AddressID" = $4 RETURNING *';
    const values = [address.LocalityID, address.AddressName, address.AddressPostalCode, id];
    const result = await pool.query(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function createAddress(address: Omit<Address, 'AddressID'>): Promise<Address> {
    const query = 'INSERT INTO "Address" ("LocalityID", "AddressName", "AddressPostalCode") VALUES ($1, $2, $3) RETURNING *';
    const values = [address.LocalityID, address.AddressName, address.AddressPostalCode];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export {
    Address,
    getAddressByName,
    getAllAddresses,
    getAddressById,
    deleteAddressById,
    updateAddressById,
    createAddress
};