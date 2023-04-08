import pool from '../../services/database';

interface Group {
    GroupID: number;
    GroupName: string;
    GroupDescription: string;
    GroupCreatedAt: Date;
    GroupModifiedAt?: Date;
}

async function getGroupById(groupId: number): Promise<Group | null> {
    const query = 'SELECT * FROM "Group" WHERE "GroupID"=$1;';
    const params = [groupId];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getGroupByName(groupName: string): Promise<Group | null> {
    const query = 'SELECT * FROM "Group" WHERE "GroupName"=$1;';
    const params = [groupName];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getAllGroups(): Promise<Group[]> {
    const query = 'SELECT * FROM "Group"';
    const result = await pool.query(query);
    return result.rows;
}

async function deleteGroupById(id: number): Promise<boolean> {
    const query = 'DELETE FROM "Group" WHERE "GroupID" = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

async function updateGroupById(id: number, group: Omit<Group, 'GroupID' | 'GroupCreatedAt' | 'GroupModifiedAt'>): Promise<Group | null> {
    const query = 'UPDATE "Group" SET "GroupName" = $1, "GroupDescription" = $2, "GroupModifiedAt" = $3 WHERE "GroupID" = $4 RETURNING *';
    const values = [group.GroupName, group.GroupDescription, new Date(), id];
    const result = await pool.query(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function createGroup(group: Omit<Group, 'GroupID' | 'GroupCreatedAt' | 'GroupModifiedAt'>): Promise<Group> {
    const query = 'INSERT INTO "Group" ("GroupName", "GroupDescription") VALUES ($1, $2) RETURNING *';
    const values = [group.GroupName, group.GroupDescription];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export {
    Group,
    getGroupByName,
    getAllGroups,
    getGroupById,
    deleteGroupById,
    updateGroupById,
    createGroup
};