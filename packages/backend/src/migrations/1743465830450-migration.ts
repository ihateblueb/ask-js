import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1743465830450 implements MigrationInterface {
	name = 'Migration1743465830450';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "used_usernames" ("username" character varying NOT NULL, CONSTRAINT "PK_78fd79d2d24c6ac2f4cc9a31a5d" PRIMARY KEY ("username"))`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "used_usernames"`);
	}
}
