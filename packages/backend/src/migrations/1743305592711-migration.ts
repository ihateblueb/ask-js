import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1743305592711 implements MigrationInterface {
	name = 'Migration1743305592711';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "invite" RENAME COLUMN "usedBy" TO "usedById"`
		);
		await queryRunner.query(
			`ALTER TABLE "invite" ADD CONSTRAINT "FK_b2057b2e416663b8388a09977cc" FOREIGN KEY ("usedById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "invite" DROP CONSTRAINT "FK_b2057b2e416663b8388a09977cc"`
		);
		await queryRunner.query(
			`ALTER TABLE "invite" RENAME COLUMN "usedById" TO "usedBy"`
		);
	}
}
