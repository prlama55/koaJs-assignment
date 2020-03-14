import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface IConfig {
    port: number;
}

const isDevMode = process.env.NODE_ENV == 'development';

export const config: IConfig = {
    port: Number(process.env.PORT) || 3000
};
