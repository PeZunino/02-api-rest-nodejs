import knex, {Knex} from 'knex';
import { env } from './env';


export const config: Knex.Config = {
	client: 'sqlite',
	connection:{
		filename: env.DATABASE_URL
	},
	useNullAsDefault:true,
	migrations: {
		extension: 'ts',
		directory: './db/migrations'
	}
};
export default knex(config);