import pool from '../../../src/services/database';
import {
  getLoginActivitiesByUserId,
  getAllLoginActivities,
  getLoginActivityById,
  deleteLoginActivityById,
  updateLoginActivityById,
  createLoginActivity,
  LoginActivity,
} from '../../../src/models/user/loginactivity.model';


import {
  Gender,
  createGender,
  deleteGenderById
} from '../../../src/models/user/gender.model';

import {
  User,
  createUser,
  deleteUserById
} from '../../../src/models/user/user.model';


describe('LoginActivity functions', () => {
  let testLoginActivity: LoginActivity;
  let testGender: Gender;
  let testUser: User;


  beforeAll(async () => {
    testGender = await createGender({
      GenderName: 'test gender - Login Activity model 11'
    });

    testUser = await createUser({
      GenderID: testGender.GenderID,
      UserEmail: 'testLoginActivity@example.com11',
      UserFullName: 'Test User',
      UserPassword: 'password',
      UserBirthdate: new Date(),
      UserIsActive: false
    });

    const result = await pool.query(
        'INSERT INTO "LoginActivity" ("UserID", "LoginActivityIP", "LoginActivityGeoLoc", "LoginActivityDate") VALUES ($1, $2, $3, $4) RETURNING *',
        [testUser.UserID, '127.0.0.1', 'Test Location', new Date()]
    );
    console.log(result);
    testLoginActivity = result.rows[0];
  });



  afterAll(async () => {
    await pool.query('DELETE FROM "LoginActivity" WHERE "LoginActivityID" = $1', [
        testLoginActivity.LoginActivityID,
    ]);
    await deleteUserById(testUser.UserID);
    await deleteGenderById(testGender.GenderID);
  });

  describe('getLoginActivityById', () => {
    it('should return the login activity with the given ID', async () => {
      const loginActivity = await getLoginActivityById(testLoginActivity.LoginActivityID);
      expect(loginActivity).toEqual(testLoginActivity);
    });

    it('should return null if the login activity does not exist', async () => {
      const loginActivity = await getLoginActivityById(-1);
      expect(loginActivity).toBeNull();
    });
  });

});