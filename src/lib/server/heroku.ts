import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

const client = await pool.connect();

export async function query(text, params) {
	const res = await client.query(text, params);
	return res;
}