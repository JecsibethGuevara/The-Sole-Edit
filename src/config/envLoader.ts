import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env');

    if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));

        for (const key in envConfig) {
            if (process.env[key] === undefined) {
                // Remove surrounding quotes from values
                let value = envConfig[key];
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        }

        console.log('✅ Environment variables loaded from .env');
        console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? '***' + process.env.JWT_SECRET.slice(-4) : 'NOT SET');
    } else {
        console.log('❌ .env file not found at:', envPath);
    }
}