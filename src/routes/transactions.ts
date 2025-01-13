import {randomUUID} from 'node:crypto';
import {FastifyInstance } from 'fastify';
import {z} from 'zod';
import knex from '../database';

export async function transactionsRoutes(server:FastifyInstance) {
	
	server.get('/', async ()=>{
		
		const transactions = await knex('transactions')
			.select();

		return {transactions};
	});

	server.get('/:id', async(request)=>{

		const getTransactionParamsSchema = z.object({
			id: z.string()
				.uuid()
		});

		const {id} = getTransactionParamsSchema.parse(request.params);

		console.log(id);

		const transaction = await knex('transactions')
			.where('id',id)
			.first();

		return {transaction};
	});

	server.get('/summary', async ()=>{
		const summary = await knex('transactions')
			.sum('amount',{as: 'amount'})
			.first();

		return {summary};
	});
	
	server.post('/', async (request,response) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum([
				'debit','credit'
			])
		});

		const {
			amount,title,type
		} = createTransactionBodySchema.parse(request.body);

		let sessionId = request.cookies.sessionId;

		if(!sessionId){
			sessionId = randomUUID();
			
			response.cookie('sessionId',sessionId,{
				path:'/',
				maxAge:  60 * 60 * 24 * 7 //7 days (1min -> 1hour -> 1day -> 7days)
			});
		}

		await knex('transactions')
			.insert({
				id: randomUUID(),
				title,
				amount: type === 'credit' ? amount : amount * -1,
				session_id: sessionId
			});

		response.status(201)
			.send();
	});
}