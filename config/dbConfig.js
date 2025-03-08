import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Sequelize configuration for Supabase
export const dbConfig = {
   dialect: 'postgres',
   host: supabaseUrl,
   port: 5432,
   database: 'postgres',
   username: 'postgres',
   password: process.env.SUPABASE_DB_PASSWORD,
   dialectOptions: {
      ssl: {
         require: true,
         rejectUnauthorized: false
      }
   }
};