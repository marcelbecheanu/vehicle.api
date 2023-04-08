import pool from '../../../src/services/database';

import {
    Group,
    getGroupByName,
    getAllGroups,
    getGroupById,
    deleteGroupById,
    updateGroupById,
    createGroup
} from '../../../src/models/group/group.model';

describe('Group functions', () => {
    let testGroup: Group;
    
    beforeAll(async () => {
        const result = await pool.query(
            'INSERT INTO "Group" ("GroupName", "GroupDescription") VALUES ($1, $2) RETURNING *',
            ['Test Group', 'Test Group Description']
        );
        testGroup = result.rows[0];
    });
    
    afterAll(async () => {
        await pool.query('DELETE FROM "Group" WHERE "GroupID" = $1', [
            testGroup.GroupID,
        ]);
    });

    describe('getGroupById', () => {
        it('should return the group with the given ID', async () => {
            const group = await getGroupById(testGroup.GroupID);
            expect(group).toEqual(testGroup);
        });
    
        it('should return null if the group does not exist', async () => {
            const group = await getGroupById(-1);
            expect(group).toBeNull();
        });
    });

    describe('getGroupByName', () => {
        it('should return the group with the given name', async () => {
            const group = await getGroupByName(testGroup.GroupName);
            expect(group).toEqual(testGroup);
        });
    
        it('should return null if the group does not exist', async () => {
            const group = await getGroupByName('non-existent-group-name');
            expect(group).toBeNull();
        });
    });

    describe('getAllGroups', () => {
        it('should return all groups', async () => {
            const groups = await getAllGroups();
            expect(groups).toContainEqual(testGroup);
        });
    });
    
    describe('updateGroupById', () => {
        it('should update the group with the given ID', async () => {
            const updatedGroupName = 'Updated Test Group';
            const updatedGroupDescription = 'Updated Test Group Description';
            const updatedGroup = await updateGroupById(testGroup.GroupID, {
                GroupName: updatedGroupName,
                GroupDescription: updatedGroupDescription,
            });
            expect(updatedGroup?.GroupName).toBe(updatedGroupName);
            expect(updatedGroup?.GroupDescription).toBe(updatedGroupDescription);
            const group = await getGroupById(testGroup.GroupID);
            expect(group?.GroupName).toBe(updatedGroupName);
            expect(group?.GroupDescription).toBe(updatedGroupDescription);
        });
    
        it('should return null if the group does not exist', async () => {
            const updatedGroup = await updateGroupById(-1, {
                GroupName: 'Updated Non-existent Group',
                GroupDescription: 'Updated Non-existent Group Description',
            });
            expect(updatedGroup).toBeNull();
        });
    });

    describe('deleteGroupById', () => {
        it('should delete the group with the given ID', async () => {
            const result = await deleteGroupById(testGroup.GroupID);
            expect(result).toBe(true);
            const group = await getGroupById(testGroup.GroupID);
            expect(group).toBeNull();
        });
    
        it('should return false if the group does not exist', async () => {
            const result = await deleteGroupById(-1);
            expect(result).toBe(false);
        });
    });

    describe('createGroup', () => {
        it('should create a new group', async () => {
            const newGroup = {
                GroupName: 'New Group',
                GroupDescription: 'New Test Group Description',
            };
            const createdGroup = await createGroup(newGroup);
            expect(createdGroup.GroupName).toBe(newGroup.GroupName);
            expect(createdGroup.GroupDescription).toBe(newGroup.GroupDescription);
            expect(createdGroup.GroupCreatedAt).toEqual(expect.any(Date));
            const group = await getGroupById(createdGroup.GroupID);
            expect(group).toEqual(createdGroup);
            await deleteGroupById(createdGroup.GroupID);
        });
    });

});