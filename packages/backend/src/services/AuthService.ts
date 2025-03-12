import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';

import IdService from './IdService.js';
import db from '../utils/db.js';
import UserService from './UserService.js';
import config from '../../../../config/config.json' with { type: 'json' };
import SanitizerService from './SanitizerService.js';
import LoggerService from './LoggerService.js';

class AuthService {
	public async verifyToken(token: string) {
		let auth = await db.getRepository('auth').findOne({
			where: { token: (token ?? '').replace('Bearer ', '') }
		});

		if (!auth) {
			LoggerService.debug('token ' + token + ' invalid');
			return {
				error: true,
				message: 'Token invalid'
			};
		}

		const user = await UserService.get({
			id: auth.user
		});

		if (!user.approved) {
			LoggerService.debug(
				'failed authentication for ' +
					auth.user +
					' because account disabled'
			);
			return {
				error: true,
				message: 'Account not enabled'
			};
		}

		LoggerService.debug('successful authentication for ' + auth.user);

		return {
			error: false,
			message: 'Authenticated',
			auth: auth
		};
	}

	public async generateToken(userId: string) {
		let auth = {
			id: IdService.generate(),
			token: crypto.randomBytes(16).toString('hex'),
			user: userId,
			createdAt: new Date().toISOString()
		};

		await db.getRepository('auth').insert(auth);

		return auth;
	}

	// login/register

	public async registerUser(
		username: string,
		password: string,
		invite?: string
	) {
		if (config.registrations === 'closed')
			return {
				error: true,
				status: 400,
				message: 'Registrations are closed'
			};

		if (config.registrations === 'invite') {
			if (!invite)
				return {
					error: true,
					status: 400,
					message: 'Registration requires an invite'
				};

			let dbInvite = await db
				.getRepository('invite')
				.findOne({ where: { code: invite } });

			if (!dbInvite)
				return {
					error: true,
					status: 400,
					message: 'Invite invalid'
				};
		}

		const id = IdService.generate();

		let user = {
			id: id,
			username: SanitizerService.sanitize(username)
		};

		if (config.registrations !== 'approval') user['approved'] = true;

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		let userPrivate = {
			id: id,
			password: hash
		};

		let existingUser = await UserService.get({
			username: username
		});

		if (existingUser) {
			return {
				error: true,
				status: 400,
				message: 'Username is taken'
			};
		}

		await db.getRepository('user').insert(user);
		await db.getRepository('user_private').insert(userPrivate);

		if (config.registrations === 'invite') {
			await db.getRepository('invite').update(
				{
					invite: invite
				},
				{
					usedBy: id
				}
			);
		}

		const auth = await this.generateToken(id);

		LoggerService.debug('account ' + user.id + ' registered');

		if (config.registrations === 'approval') {
			return {
				error: false,
				status: 200,
				message: 'Awaiting approval from administrator',
				user: await UserService.get({ id: id })
			};
		} else {
			return {
				error: false,
				status: 200,
				message: 'User created',
				user: await UserService.get({ id: id }),
				token: auth.token
			};
		}
	}

	public async loginUser(username: string, password: string) {
		const user = await UserService.get({ username: username });

		if (!user)
			return { error: true, status: 404, message: 'User not found' };

		const userPrivate = await UserService.getPrivate({ id: user.id });

		if (!userPrivate)
			return { error: true, status: 404, message: 'User not found' };

		if (!user.approved)
			return { error: true, status: 400, message: 'User not enabled' };

		const doesPasswordMatch = bcrypt.compareSync(
			password,
			userPrivate.password
		);

		if (!doesPasswordMatch)
			return { error: true, status: 400, message: 'Invalid password' };

		const auth = await this.generateToken(user.id);

		return {
			error: false,
			status: 200,
			message: 'Authenticated',
			user: await UserService.get({ id: user.id }),
			token: auth.token
		};
	}
}

export default new AuthService();
