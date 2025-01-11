import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('transactions',(table)=>{
		table.uuid('session_id')
			.after('id')
			.index(); // declara que vamos fazer mts buscas pelo campo
	});
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('transactions',(table)=>{
		table.dropColumn('session_id');
	});
}

