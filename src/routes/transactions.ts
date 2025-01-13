import crypto from 'node:crypto';
import { FastifyInstance } from 'fastify';
import {z} from 'zod';
import knex from '../database';

export async function transactionsRoutes(server:FastifyInstance){
	server.post('/', async (request,response) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(['debit','credit'])
		});

		const {amount,title,type} = createTransactionBodySchema.parse(request.body);

		console.log(amount,title,type);

		await knex('transactions')
			.insert({
				id: crypto.randomUUID(),
				title,
				amount: type === 'credit' ? amount : amount * -1,
			});

		response.status(201)
			.send();
	});
}