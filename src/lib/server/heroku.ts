import { Client } from 'pg';

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

client.connect();

export async function query(text: string, params: string) {
	const res = await pool.query(text, params);
	return res;
}
