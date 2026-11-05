import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { MongoClient } from 'mongodb';

const uri =
  process.env.MONGODB_URI ||
  'mongodb://ayroclothingbd:o3krfgy7h7tnVChb@ac-84aybhg-shard-00-00.d78dlkm.mongodb.net:27017,ac-84aybhg-shard-00-01.d78dlkm.mongodb.net:27017,ac-84aybhg-shard-00-02.d78dlkm.mongodb.net:27017/?ssl=true&replicaSet=atlas-kekyt7-shard-0&authSource=admin';

const client = new MongoClient(uri);
const db = client.db('clothspaceDB');

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || 'clothspace_better_auth_secret_key_2026_super_secure_random',
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  plugins: [nextCookies()],
});
