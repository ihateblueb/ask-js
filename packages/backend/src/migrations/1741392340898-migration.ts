import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741392340898 implements MigrationInterface {
	name = 'Migration1741392340898';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" ADD "acceptAsks" boolean NOT NULL DEFAULT true`
		);
		await queryRunner.query(
			`ALTER TABLE "user" ADD "showResponses" boolean NOT NULL DEFAULT true`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ADD "read" boolean NOT NULL DEFAULT false`
		);
		await queryRunner.query(
			`ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."notification_type_enum" AS ENUM('ask', 'comment')`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum" USING "type"::"text"::"public"."notification_type_enum"`
		);
		await queryRunner.query(
			`DROP TYPE "public"."notification_type_enum_old"`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."notification_type_enum_old" AS ENUM('comment')`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`
		);
		await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
		await queryRunner.query(
			`ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`
		);
		await queryRunner.query(
			`ALTER TABLE "notification" DROP COLUMN "read"`
		);
		await queryRunner.query(
			`ALTER TABLE "user" DROP COLUMN "showResponses"`
		);
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "acceptAsks"`);
	}
}
