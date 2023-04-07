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
} from '../../src/models/locality.model';

import {
    Address,
    getAddressByName,
    getAllAddresses,
    getAddressById,
    deleteAddressById,
    updateAddressById,
    createAddress
} from '../../src/models/address.model';

describe('Address functions', () => {
    let testCountry: Country;
    let testDistrict: District;
    let testLocality: Locality;
    let testAddress: Address;

    beforeAll(async () => {
        testCountry = await createCountry({ CountryName: 'Test Country - Address' });
        testDistrict = await createDistrict({ CountryID: testCountry.CountryID, DistrictName: 'Test District - Address' });
        testLocality = await createLocality({ DistrictID: testDistrict.DistrictID, LocalityName: 'Test Locality - Address' });
        const result = await pool.query(
            'INSERT INTO "Address" ("LocalityID", "AddressName", "AddressPostalCode") VALUES ($1, $2, $3) RETURNING *',
            [testLocality.LocalityID, 'Test Address', '12345']
        );
        testAddress = result.rows[0];
    });

    afterAll(async () => {
        await pool.query('DELETE FROM "Address" WHERE "AddressID" = $1', [
            testAddress.AddressID,
        ]);
        await deleteLocalityById(testLocality.LocalityID);
        await deleteDistrictById(testDistrict.DistrictID);
        await deleteCountryById(testCountry.CountryID);
    });

    describe('getAddressByName', () => {
        it('should return the address with the given name', async () => {
            const address = await getAddressByName('Test Address');
            expect(address).toEqual(testAddress);
        });

        it('should return null if the address does not exist', async () => {
            const address = await getAddressByName('Non-existent Address');
            expect(address).toBeNull();
        });
    });

    describe('getAllAddress', () => {
        it('should return all addresses', async () => {
            const addresses = await getAllAddresses();
            expect(addresses).toContainEqual(testAddress);
        });
    });

    describe('getAddressById', () => {
        it('should return the address with the given ID', async () => {
            const address = await getAddressById(testAddress.AddressID);
            expect(address).toEqual(testAddress);
        });

        it('should return null if the address does not exist', async () => {
            const address = await getAddressById(-1);
            expect(address).toBeNull();
        });
    });

    describe('updateAddressById', () => {
        it('should update the address with the given ID', async () => {
            const updatedAddressName = 'Updated Test Address';
            const updatedAddress = await updateAddressById(testAddress.AddressID, { LocalityID: testLocality.LocalityID, AddressName: updatedAddressName, AddressPostalCode: '23456' });
            expect(updatedAddress).toEqual({ ...testAddress, LocalityID: testLocality.LocalityID, AddressName: updatedAddressName, AddressPostalCode: '23456' });
            const address = await getAddressById(testAddress.AddressID);
            expect(address).toEqual({ ...testAddress, LocalityID: testLocality.LocalityID, AddressName: updatedAddressName, AddressPostalCode: '23456' });
        });
    
        it('should return null if the address does not exist', async () => {
            const updatedAddress = await updateAddressById(-1, { LocalityID: testLocality.LocalityID, AddressName: 'Updated Non-existent Address', AddressPostalCode: '12345' });
            expect(updatedAddress).toBeNull();
        });
    });
    
    
    describe('deleteAddressById', () => {
        it('should delete the address with the given ID', async () => {
            const result = await deleteAddressById(testAddress.AddressID);
            expect(result).toBe(true);
            const address = await getAddressById(testAddress.AddressID);
            expect(address).toBeNull();
        });
    
        it('should return false if the address does not exist', async () => {
            const result = await deleteAddressById(-1);
            expect(result).toBe(false);
        });
    });
    

    describe('createAddress', () => {
        it('should create a new address', async () => {
            const newAddress = { LocalityID: testLocality.LocalityID, AddressName: 'New Address', AddressPostalCode: '11111' };
            const result = await createAddress(newAddress);
            expect(result.LocalityID).toBe(newAddress.LocalityID);
            expect(result.AddressName).toBe(newAddress.AddressName);
            expect(result.AddressPostalCode).toBe(newAddress.AddressPostalCode);
            const address = await getAddressById(result.AddressID);
            expect(address).toEqual(result);
            await deleteAddressById(result.AddressID);
        });
    });

});
