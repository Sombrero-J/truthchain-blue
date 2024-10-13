import pg from 'pg';
// import express from 'express';

	// "start": "node src/lib/server/heroku.js"

const { Pool } = pg;
// const app = express();

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
// 	console.log(`Server is running on port ${PORT}`);
// });

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
