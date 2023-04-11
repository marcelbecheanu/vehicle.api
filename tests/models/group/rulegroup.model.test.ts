import pool from '../../../src/services/database';

import {
    Rule,
    createRule,
    deleteRuleById
} from '../../../src/models/group/rule.model';

import { 
    Group,
    createGroup,
    deleteGroupById
} from '../../../src/models/group/group.model';

import {
    RuleGroup,
    addRuleToGroup,
    removeRuleFromGroup,
    getAllRulesFromGroup,
    getAllGroupsWithRules,
    isRuleOnGroup
} from '../../../src/models/group/rulegroup.model';

describe('RuleGroup functions', () => {
    let testRule: Rule;
    let testGroup: Group;
    let testRuleGroup: RuleGroup;

    beforeAll(async () => {
        testRule = await createRule({ RuleName: "Test Rule - RuleGroup", RuleDescription: "test", RuleCode: "test"});
        testGroup = await createGroup({ GroupName: "Test Group - RuleGroup", GroupDescription: "test" });


        const result = await pool.query('INSERT INTO "RuleGroup" ("RuleID", "GroupID") VALUES ($1, $2) RETURNING *', [testRule.RuleID, testGroup.GroupID]);
        testRuleGroup = result.rows[0];
    });

    afterAll(async () => {
        await pool.query('DELETE FROM "RuleGroup" WHERE "RuleID" = $1 AND "GroupID" = $2;', [testRuleGroup.RuleID, testRuleGroup.GroupID]);
        await deleteGroupById(testGroup.GroupID);
        await deleteRuleById(testRule.RuleID);
    });

    describe('addRuleToGroup', () => {
        it('should add a rule to a group', async () => {

            let testRuleLocal = await createRule({ RuleName: "Test Rule - RuleGroup 2", RuleDescription: "test 2", RuleCode: "test 2"});
            let testGroupLocal = await createGroup({ GroupName: "Test Group - RuleGroup 2", GroupDescription: "test 2" });

            const ruleGroup = await addRuleToGroup({
                RuleID: testRuleLocal.RuleID,
                GroupID: testGroupLocal.GroupID,
            });

            expect(ruleGroup).not.toBeNull();
            expect(ruleGroup.RuleID).toBe(testRuleLocal.RuleID);
            expect(ruleGroup.GroupID).toBe(testGroupLocal.GroupID);
            
            const result = await removeRuleFromGroup({
                RuleID: testRuleLocal.RuleID,
                GroupID: testGroupLocal.GroupID,
            });
            expect(result).toBe(true);

            await deleteRuleById(testRuleLocal.RuleID);
            await deleteGroupById(testGroupLocal.GroupID);
        });
    });

    describe('getAllRulesFromGroup', () => {
        it('should get all rules from a group', async () => {
            const ruleGroup = await getAllRulesFromGroup(testGroup.GroupID);
            expect(ruleGroup).toHaveLength(1);
            expect(ruleGroup[0].RuleID).toBe(testRule.RuleID);
            expect(ruleGroup[0].GroupID).toBe(testGroup.GroupID);
        });
    
        it('should return an empty array if the group does not exist', async () => {
            const ruleGroup = await getAllRulesFromGroup(9999);
            expect(ruleGroup).toHaveLength(0);
        });
    });
    
    describe('getAllGroupsWithRules', () => {
        it('should get all groups with rules', async () => {
            const ruleGroup = await getAllGroupsWithRules();
            expect(ruleGroup).not.toBeNull();
            expect(ruleGroup.length).toBeGreaterThan(0);
        });
    });
    
    describe('isRuleOnGroup', () => {
        it('should return true if the rule is in the group', async () => {
            const result = await isRuleOnGroup({
                RuleID: testRule.RuleID,
                GroupID: testGroup.GroupID,
            });
            expect(result).toBe(true);
        });
    
        it('should return false if the rule is not in the group', async () => {
            const result = await isRuleOnGroup({
                RuleID: 9999999,
                GroupID: 0
            });
            expect(result).toBe(false);
        });
    });
    
    describe('removeRuleFromGroup', () => {
        it('should remove a rule from a group', async () => {
            const result = await removeRuleFromGroup({
                RuleID: testRule.RuleID,
                GroupID: testGroup.GroupID,
            });
            expect(result).toBe(true);
            const ruleGroup = await pool.query(
                'SELECT * FROM "RuleGroup" WHERE "RuleID" = $1 AND "GroupID" = $2',
                [testRule.RuleID, testGroup.GroupID]
                );
                expect(ruleGroup.rows.length).toBe(0);
            });
            
            it('should return false if the rule is not in the group', async () => {
                const result = await removeRuleFromGroup({
                    RuleID: testRule.RuleID,
                    GroupID: testGroup.GroupID,
                });
                expect(result).toBe(false);
            });
            
        });
        
    
});