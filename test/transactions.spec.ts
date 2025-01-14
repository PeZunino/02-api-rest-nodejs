import {execSync} from 'node:child_process';
import request from 'supertest';
import { afterAll,beforeAll,beforeEach,describe, expect,it } from 'vitest';
import {app} from '../src/app';

describe('Transactions routes',()=>{
	beforeAll( async ()=>{
		await app.ready(); // resolver a Promise qnd. o fastify terminar de cadastrar os plugins (rotas)
	});
	
	afterAll(async()=>{
		await app.close(); //remover da memória
	});
	
	beforeEach(()=>{
		// toda vez que um teste executa é ideal ter um ambiente 
		// totalmente zerado pois evita conflitos, imagina se o cookie
		// identificasse o user, ele iria listar a transacao feita
		// tambem no teste anterior, iria listar 2 transações
		// ao inves de uma 
		execSync('npm run knex migrate:rollback --all'); //apaga o banco
		
		execSync('npm run knex migrate:latest'); //cria dnv
	});

	it('should be able to create a new transaction', async ()=>{
		await request(app.server)
			.post('/transactions')
			.send({
				title: 'New transaction',
				amount: 5000,
				type: 'credit'
			})
			.expect(201);
	});
	
	it('should be able to list all transactions', async ()=>{
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'New transaction',
				amount: 5000,
				type: 'credit'
			});
		
		const cookies = createTransactionResponse.get('Set-Cookie') ?? [];

		const listTransactionsResponse = await request(app.server)
			.get('/transactions')
			.set('Cookie',cookies)
			.expect(200);

		expect(listTransactionsResponse.body.transactions)
			.toEqual([
				expect.objectContaining({
					title: 'New transaction',
					amount: 5000,
				})
			]);
	});

	it('should be able to get a specific transaction', async ()=>{
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'New transaction',
				amount: 5000,
				type: 'credit'
			});
		
		const cookies = createTransactionResponse.get('Set-Cookie') ?? [];

		const listTransactionsResponse = await request(app.server)
			.get('/transactions')
			.set('Cookie',cookies)
			.expect(200);

		const transactionId = listTransactionsResponse.body.transactions[0].id;

		const getTransactionResponse = await request(app.server)
			.get(`/transactions/${transactionId}`)
			.set('Cookie',cookies)
			.expect(200);

		expect(getTransactionResponse.body.transaction)
			.toEqual(
				expect.objectContaining({
					title: 'New transaction',
					amount: 5000,
				})
			);
	});

	it('should be able to get the summary', async ()=>{
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'Credit transaction',
				amount: 5000,
				type: 'credit'
			});
		
		const cookies = createTransactionResponse.get('Set-Cookie') ?? [];

		await request(app.server)
			.post('/transactions')
			.set('Cookie',cookies)
			.send({
				title: 'Debit transaction',
				amount: 2000,
				type: 'credit'
			});


		const summaryResponse = await request(app.server)
			.get('/summary')
			.set('Cookie',cookies)
			.expect(200);

		expect(summaryResponse.body.summary)
			.toEqual({amount: 3000});
	});
});