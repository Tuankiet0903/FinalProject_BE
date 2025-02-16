import 'dotenv/config'

export const env = {
    DATABASE_NAME: process.env.DB_NAME,
    DATABASE_USERNAME: process.env.DB_USERNAME,
    BUILD_MODE: process.env.BUILD_MODE,
}