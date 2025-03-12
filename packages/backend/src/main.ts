import Fastify from 'fastify';
import pkg from '../../../package.json' with { type: 'json' };
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifyApiReference from '@scalar/fastify-api-reference';
import fastifyAutoload from '@fastify/autoload';
import * as path from 'node:path';
import db from './utils/db.js';
import AuthService from './services/AuthService.js';
import fastifyAuth from '@fastify/auth';
import { handler } from 'frontend/build/handler.js';
import config from '../../../config/config.json' with { type: 'json' };
import IdService from './services/IdService.js';
import fastifyStatic from '@fastify/static';
import LoggerService from './services/LoggerService.js';
import chalk from 'chalk';

const fastify = Fastify({
	logger: false,
	genReqId: () => IdService.generate()
});

await db.initialize().then(() => {
	LoggerService.done('database initialized');
});

fastify
	.addHook('preHandler', (req, reply, done) => {
		reply.header('TDM-Reservation', '1');

		if (req.url && !req.url.startsWith('/_app'))
			LoggerService.http(
				`-->	${req.method.toLowerCase()} ${req.url} ${chalk.gray('(' + req.id + ')')}`
			);

		done();
	})
	.addHook('onResponse', (req, reply, done) => {
		if (req.url && !req.url.startsWith('/_app'))
			LoggerService.http(
				`<--	${req.method.toLowerCase()} ${req.url} ${reply.statusCode} ${chalk.gray('(' + req.id + ')')}`
			);

		done();
	})
	.register(fastifyRateLimit, {
		max: 250,
		timeWindow: '1 minute'
	})
	.register(fastifySwagger, {
		openapi: {
			info: {
				title: 'Aster Route Reference',
				version: pkg.version
			},
			components: {
				securitySchemes: {
					header: {
						type: 'http',
						scheme: 'bearer'
					}
				}
			}
		}
	})
	.register(fastifyApiReference, {
		routePrefix: '/api-doc',
		configuration: {}
	})
	.decorate('requireAuth', async (req, reply) => {
		let auth = await AuthService.verifyToken(req.headers.authorization);
		if (auth.error) throw new Error(auth.message);
		req.auth = auth?.auth;
	})
	.decorate('optionalAuth', async (req, reply, done) => {
		req.auth = (
			await AuthService.verifyToken(req.headers.authorization)
		)?.auth;
	})
	.register(fastifyAuth)
	.register(fastifyAutoload, {
		dir: path.join(process.cwd(), 'built', 'routes')
	})
	.register(fastifyStatic, {
		root: path.resolve(process.cwd(), 'src', 'static'),
		prefix: '/static'
	})
	.get('/*', (req, reply) => {
		handler(req.raw, reply.raw, () => {});
	});

await fastify;

fastify.listen(
	{ host: config.host ?? '0.0.0.0', port: Number(config.port ?? 3579) },
	function (err, address) {
		if (err) {
			console.log(err);
			process.exit(1);
		} else {
			LoggerService.done(
				'listening on ' +
					(config.host ?? '0.0.0.0') +
					':' +
					Number(config.port ?? 3579)
			);
		}
	}
);
