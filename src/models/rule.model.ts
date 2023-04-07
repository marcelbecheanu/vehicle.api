import pool from './../services/database';

interface Rule {
    RuleID: number;
    RuleName: string;
    RuleDescription: string;
    RuleCode: string;
    RuleCreatedAt: Date;
    RuleModifiedAt?: Date;
}

async function getRuleById(ruleId: number): Promise<Rule | null> {
    const query = 'SELECT * FROM "Rule" WHERE "RuleID"=$1;';
    const params = [ruleId];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getRuleByCode(ruleCode: string): Promise<Rule | null> {
    const query = 'SELECT * FROM "Rule" WHERE "RuleCode"=$1;';
    const params = [ruleCode];
    const result = await pool.query(query, params);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function getAllRules(): Promise<Rule[]> {
    const query = 'SELECT * FROM "Rule"';
    const result = await pool.query(query);
    return result.rows;
}

async function deleteRuleById(id: number): Promise<boolean> {
    const query = 'DELETE FROM "Rule" WHERE "RuleID" = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
}

async function updateRuleById(id: number, rule: Omit<Rule, 'RuleID' | 'RuleCreatedAt' | 'RuleModifiedAt'>): Promise<Rule | null> {
    const query = 'UPDATE "Rule" SET "RuleName" = $1, "RuleDescription" = $2, "RuleCode" = $3, "RuleModifiedAt" = $4 WHERE "RuleID" = $5 RETURNING *';
    const values = [rule.RuleName, rule.RuleDescription, rule.RuleCode, new Date(), id];
    const result = await pool.query(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
}

async function createRule(rule: Omit<Rule, 'RuleID' | 'RuleCreatedAt' | 'RuleModifiedAt'>): Promise<Rule> {
    const query = 'INSERT INTO "Rule" ("RuleName", "RuleDescription", "RuleCode") VALUES ($1, $2, $3) RETURNING *';
    const values = [rule.RuleName, rule.RuleDescription, rule.RuleCode];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export {
    Rule,
    getRuleByCode,
    getAllRules,
    getRuleById,
    deleteRuleById,
    updateRuleById,
    createRule
};