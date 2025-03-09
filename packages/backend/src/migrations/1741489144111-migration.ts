import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741489144111 implements MigrationInterface {
	name = 'Migration1741489144111';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" RENAME COLUMN "acceptAsks" TO "acceptingAsks"`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" RENAME COLUMN "acceptingAsks" TO "acceptAsks"`
		);
	}
}
