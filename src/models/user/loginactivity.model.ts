import pool from '../../services/database';

interface LoginActivity {
  LoginActivityID: number;
  UserID: number;
  LoginActivityIP?: string;
  LoginActivityGeoLoc?: string;
  LoginActivityDate?: Date;
}

async function getLoginActivityById(loginActivityId: number): Promise<LoginActivity | null> {
 const query = 'SELECT * FROM "LoginActivity" WHERE "LoginActivityID" = $1;';
 const params = [loginActivityId];
 const result = await pool.query(query, params);
 return result.rowCount === 0 ? null : result.rows[0];
}

async function getLoginActivitiesByUserId(userId: number): Promise<LoginActivity[]> {
 const query = 'SELECT * FROM "LoginActivity" WHERE "UserID" = $1;';
 const params = [userId];
 const result = await pool.query(query, params);
 return result.rows;
}

async function getAllLoginActivities(): Promise<LoginActivity[]> {
 const query = 'SELECT * FROM "LoginActivity"';
 const result = await pool.query(query);
 return result.rows;
}

async function deleteLoginActivityById(id: number): Promise<boolean> {
 const query = 'DELETE FROM "LoginActivity" WHERE "LoginActivityID" = $1';
 const values = [id];
 const result = await pool.query(query, values);
 return result.rowCount > 0;
}

async function updateLoginActivityById(id: number, loginActivity: Omit<LoginActivity, 'LoginActivityID'>): Promise<LoginActivity | null> {
 const query = 'UPDATE "LoginActivity" SET "UserID" = $1, "LoginActivityIP" = $2, "LoginActivityGeoLoc" = $3, "LoginActivityDate" = $4 WHERE "LoginActivityID" = $5 RETURNING *';
 const values = [loginActivity.UserID, loginActivity.LoginActivityIP, loginActivity.LoginActivityGeoLoc, loginActivity.LoginActivityDate, id];
 const result = await pool.query(query, values);
 return result.rowCount === 0 ? null : result.rows[0];
}

async function createLoginActivity(loginActivity: Omit<LoginActivity, 'LoginActivityID'>): Promise<LoginActivity> {
 const query = 'INSERT INTO "LoginActivity" ("UserID", "LoginActivityIP", "LoginActivityGeoLoc", "LoginActivityDate") VALUES ($1, $2, $3, $4) RETURNING *';
 const values = [loginActivity.UserID, loginActivity.LoginActivityIP, loginActivity.LoginActivityGeoLoc, loginActivity.LoginActivityDate];
 const result = await pool.query(query, values);
 return result.rows[0];
}

export {
 LoginActivity,
 getLoginActivitiesByUserId,
 getAllLoginActivities,
 getLoginActivityById,
 deleteLoginActivityById,
 updateLoginActivityById,
 createLoginActivity
};
