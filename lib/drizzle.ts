import { drizzle } from "drizzle-orm/neon-http";

export default drizzle(process.env.DATABASE_URL!);
