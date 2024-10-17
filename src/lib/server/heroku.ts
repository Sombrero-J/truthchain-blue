import type BigNumber from 'bignumber.js';
import pg from 'pg';

// "start": "node src/lib/server/heroku.js"

const { Pool } = pg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

export const client = await pool.connect();

type StringOrBooleanArray = (string | boolean | BigNumber)[];

export const query = async(text: string, values: StringOrBooleanArray) => {
	const res = client.query(text, values);
	return res;
}