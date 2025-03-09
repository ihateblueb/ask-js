import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741461501972 implements MigrationInterface {
	name = 'Migration1741461501972';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "notification" DROP CONSTRAINT "FK_8dcb425fddadd878d80bf5fa195"`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" DROP CONSTRAINT "FK_c30b94552bcb52f6e2cb68fb545"`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ALTER COLUMN "commentId" DROP NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ALTER COLUMN "askId" DROP NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ADD CONSTRAINT "FK_8dcb425fddadd878d80bf5fa195" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ADD CONSTRAINT "FK_c30b94552bcb52f6e2cb68fb545" FOREIGN KEY ("askId") REFERENCES "ask"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "notification" DROP CONSTRAINT "FK_c30b94552bcb52f6e2cb68fb545"`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" DROP CONSTRAINT "FK_8dcb425fddadd878d80bf5fa195"`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ALTER COLUMN "askId" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ALTER COLUMN "commentId" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ADD CONSTRAINT "FK_c30b94552bcb52f6e2cb68fb545" FOREIGN KEY ("askId") REFERENCES "ask"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ADD CONSTRAINT "FK_8dcb425fddadd878d80bf5fa195" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}
}
