import pool from '../../../src/services/database';

import {
    Rule,
    getRuleByCode,
    getAllRules,
    getRuleById,
    deleteRuleById,
    updateRuleById,
    createRule
} from '../../../src/models/group/rule.model';

describe('Rule functions', () => {
    let testRule: Rule;

    beforeAll(async () => {
        const result = await pool.query(
            'INSERT INTO "Rule" ("RuleName", "RuleDescription", "RuleCode") VALUES ($1, $2, $3) RETURNING *',
            ['Test Rule', 'Test Rule Description', 'test-rule-code']
        );
        testRule = result.rows[0];
    });

    afterAll(async () => {
        await pool.query('DELETE FROM "Rule" WHERE "RuleID" = $1', [
            testRule.RuleID,
        ]);
    });

    describe('getRuleById', () => {
        it('should return the rule with the given ID', async () => {
            const rule = await getRuleById(testRule.RuleID);
            expect(rule).toEqual(testRule);
        });

        it('should return null if the rule does not exist', async () => {
            const rule = await getRuleById(-1);
            expect(rule).toBeNull();
        });
    });

    describe('getRuleByCode', () => {
        it('should return the rule with the given code', async () => {
            const rule = await getRuleByCode(testRule.RuleCode);
            expect(rule).toEqual(testRule);
        });

        it('should return null if the rule does not exist', async () => {
            const rule = await getRuleByCode('non-existent-rule-code');
            expect(rule).toBeNull();
        });
    });

    describe('getAllRules', () => {
        it('should return all rules', async () => {
            const rules = await getAllRules();
            expect(rules).toContainEqual(testRule);
        });
    });

    describe('updateRuleById', () => {
        it('should update the rule with the given ID', async () => {
            const updatedRuleName = 'Updated Test Rule';
            const updatedRule = await updateRuleById(testRule.RuleID, {
                RuleName: updatedRuleName,
                RuleDescription: 'Updated Test Rule Description',
                RuleCode: 'updated-test-rule-code',
            });
            expect(updatedRule).toEqual({
                ...testRule,
                RuleName: updatedRuleName,
                RuleDescription: 'Updated Test Rule Description',
                RuleCode: 'updated-test-rule-code',
                RuleModifiedAt: expect.any(Date),
            });
            const rule = await getRuleById(testRule.RuleID);
            expect(rule).toEqual({
                ...testRule,
                RuleName: updatedRuleName,
                RuleDescription: 'Updated Test Rule Description',
                RuleCode: 'updated-test-rule-code',
                RuleModifiedAt: expect.any(Date),
            });
        });

        it('should return null if the rule does not exist', async () => {
            const updatedRule = await updateRuleById(-1, {
                RuleName: 'Updated Non-existent Rule',
                RuleDescription: 'Updated Non-existent Rule Description',
                RuleCode: 'updated-non-existent-rule-code',
            });
            expect(updatedRule).toBeNull();
        });
    });

    describe('deleteRuleById', () => {
        it('should delete the rule with the given ID', async () => {
            const result = await deleteRuleById(testRule.RuleID);
            expect(result).toBe(true);
            const rule = await getRuleById(testRule.RuleID);
            expect(rule).toBeNull();
        });

        it('should return false if the rule does not exist', async () => {
            const result = await deleteRuleById(-1);
            expect(result).toBe(false);
        });
    });

    describe('createRule', () => {
        it('should create a new rule', async () => {
            const newRule = {
                RuleName: 'New Rule',
                RuleDescription: 'New Test Rule Description',
                RuleCode: 'new-test-rule-code',
            };
            const createdRule = await createRule(newRule);
            expect(createdRule.RuleName).toBe(newRule.RuleName);
            expect(createdRule.RuleCode).toBe(newRule.RuleCode);
            expect(createdRule.RuleDescription).toBe(newRule.RuleDescription);
            const rule = await getRuleById(createdRule.RuleID);
            expect(rule).toEqual(createdRule);
            await deleteRuleById(createdRule.RuleID);
        });
    });
});