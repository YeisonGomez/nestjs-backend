import { parse } from "dotenv";
import { existsSync, readFileSync } from "fs";

interface EnvConfig {
	[prop: string]: string;
}

export class ConfigService {
	private readonly envConfig: EnvConfig;
	private readonly filePath = `.env`;
	private readonly isLocal;

	constructor() {
		this.envConfig = process.env.DB_HOST ? process.env : parse(readFileSync(this.filePath, "utf-8"))
		this.isLocal = this.envConfig.NODE_ENV == 'local';
	}

	get app(): any {
		return {
			appPort: parseInt(this.envConfig.PORT),
			appHostServer: !this.isLocal ? this.envConfig.APP_HOST_SERVER : `${this.envConfig.APP_HOST_SERVER}:${this.envConfig.PORT}`,
			appHostClient: this.envConfig.APP_HOST_CLIENT
		}
	}

	get env(): string {
		return process.env.NODE_ENV || "development"
	}

	get sendgrid(): any {
		return {
			apiKey: this.envConfig.SENDGRID_API_KEY
		}
	}

	get gcp(): any {
		return {
			bucket: this.envConfig.GCS_BUCKET
		}
	}

	get orm_config(): any {
		const pathEntities = [(this.isLocal ? 'dist/entities/**/*.js' : 'src/entities/**/*.ts')];
		
		const configDefault = {
			type: this.envConfig.DB_TYPE,
			host: this.envConfig.DB_HOST,
			port: this.envConfig.DB_PORT,
			username: this.envConfig.DB_USERNAME,
			password: this.envConfig.DB_PASSWORD,
			database: this.envConfig.DB_DATABASE,
			synchronize: true,
			logging: false
		}

		return {
			users: {
				...configDefault,
				name: 'users',
				entities: pathEntities
			}
		}
	}
}

export default new ConfigService()
export const InstanceConfigService = new ConfigService()