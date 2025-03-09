import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741399671886 implements MigrationInterface {
	name = 'Migration1741399671886';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "notification" DROP CONSTRAINT "FK_3d1d1eefef4ce87fae858ff2bb5"`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ALTER COLUMN "fromId" DROP NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ADD CONSTRAINT "FK_3d1d1eefef4ce87fae858ff2bb5" FOREIGN KEY ("fromId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "notification" DROP CONSTRAINT "FK_3d1d1eefef4ce87fae858ff2bb5"`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ALTER COLUMN "fromId" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ADD CONSTRAINT "FK_3d1d1eefef4ce87fae858ff2bb5" FOREIGN KEY ("fromId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}
}
