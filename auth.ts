import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: new Pool({
        connectionString:
            process.env.DATABASE_URL ||
            "postgresql://neondb_owner:npg_Vw9tSynGvMj8@ep-sparkling-hill-ahthdd5c-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    }),
    appName: "my-v0-project",
    plugins: [nextCookies()],
});
