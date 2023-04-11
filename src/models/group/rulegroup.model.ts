import pool from '../../services/database';

interface RuleGroup {
    RuleID: number;
    GroupID: number;
    RuleGroupCreatedAt: Date;
    RuleGroupModifiedAt?: Date;
}

async function addRuleToGroup(rulegroup: Omit<RuleGroup, "RuleGroupCreatedAt" | "RuleGroupModifiedAt">): Promise<RuleGroup> {
    const query = 'INSERT INTO "RuleGroup" ("RuleID", "GroupID") VALUES ($1, $2) RETURNING *';
    const values = [rulegroup.RuleID, rulegroup.GroupID];
    const result = await pool.query(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function removeRuleFromGroup(rulegroup: Omit<RuleGroup, "RuleGroupCreatedAt" | "RuleGroupModifiedAt">): Promise<boolean> {
    const query = 'DELETE FROM "RuleGroup" WHERE "RuleID" = $1 AND "GroupID" = $2;';
    const values = [ rulegroup.RuleID, rulegroup.GroupID ];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

async function getAllRulesFromGroup(id: number): Promise<RuleGroup[]> {
    const query = 'SELECT rg."RuleID", rg."GroupID", gp."GroupName", gp."GroupDescription", rl."RuleName", rl."RuleDescription", rl."RuleCode"  FROM "RuleGroup" as rg JOIN "Group" as gp ON gp."GroupID" = rg."GroupID" JOIN "Rule" as rl ON rl."RuleID" = rg."RuleID" WHERE rg."GroupID" = $1;';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows; 
}

async function getAllGroupsWithRules(): Promise<RuleGroup[]>{
    const query = 'SELECT rg."RuleID", rg."GroupID", gp."GroupName", gp."GroupDescription", rl."RuleName", rl."RuleDescription", rl."RuleCode"  FROM "RuleGroup" as rg JOIN "Group" as gp ON gp."GroupID" = rg."GroupID" JOIN "Rule" as rl ON rl."RuleID" = rg."RuleID";';
    const result = await pool.query(query);
    return result.rows; 
}

async function isRuleOnGroup(rulegroup: Omit<RuleGroup, "RuleGroupCreatedAt" | "RuleGroupModifiedAt">): Promise<boolean> {
    const query = 'SELECT * FROM "RuleGroup" WHERE "RuleID" = $1 AND "GroupID" = $2;';
    const values = [rulegroup.RuleID, rulegroup.GroupID];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

export {
    RuleGroup,
    addRuleToGroup,
    removeRuleFromGroup,
    getAllRulesFromGroup,
    getAllGroupsWithRules,
    isRuleOnGroup
};
