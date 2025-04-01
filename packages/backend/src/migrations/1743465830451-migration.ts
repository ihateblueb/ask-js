import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1743465830451 implements MigrationInterface {
	name = 'Migration1743465830451';

	public async up(queryRunner: QueryRunner): Promise<void> {
		let users = await queryRunner.query(`SELECT "username" FROM "user"`);

		for (const user of users) {
			await queryRunner.query(
				`INSERT INTO "used_usernames" (username) VALUES ('${String(user?.username).toLowerCase()}')`
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// down not needed here
	}
}
