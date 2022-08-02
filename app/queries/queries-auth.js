import { pool } from '../config/db.js'
const db = pool

const runQuery = async (query, ...args) => {
    console.log(`DB Request:::[${query}]::ARGS::[${args.join(",")}]`);
    const result = await db.query(query, args);
    console.log(
      `DB Result:::${result.rowLength} results::[${JSON.stringify(result.rows)}]`
    );
    return result.rows;
  };

const Queries = {
    Users: {
      Create: async (email) =>
        await runQuery(
          "INSERT INTO users (email) VALUES ($1)",
          email
        ),
      Get: {
        ByEmail: async (email) =>
          await runQuery(
            "SELECT id, email, name, memberno FROM users WHERE email = $1",
            email
          ),
      },
    },
    Otp: {
      Create: async (user_id, code) =>
        await runQuery(
          "INSERT INTO otp (user_id, code) VALUES ($1, $2)",
          user_id,
          code
        ),
      Delete: {
        ByUserId: async (user_id) =>
          await runQuery("DELETE FROM otp WHERE user_id = $1", user_id),
      },
      Get: {
        ByUserId: async (user_id) =>
          await runQuery(
            "SELECT code, created_at FROM otp WHERE user_id = $1",
            user_id
          ),
      },
    },
  };

export {
  runQuery,
  Queries,
}