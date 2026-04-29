import dotenv from "dotenv";

dotenv.config();

const configs = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
}

console.log(configs);

export { configs };