import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741803290662 implements MigrationInterface {
	name = 'Migration1741803290662';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "ask" RENAME COLUMN "to" TO "toId"`
		);
		await queryRunner.query(
			`ALTER TABLE "ask" ADD CONSTRAINT "FK_db634496f086d84c9a067824e9a" FOREIGN KEY ("toId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "ask" DROP CONSTRAINT "FK_db634496f086d84c9a067824e9a"`
		);
		await queryRunner.query(
			`ALTER TABLE "ask" RENAME COLUMN "toId" TO "to"`
		);
	}
}
