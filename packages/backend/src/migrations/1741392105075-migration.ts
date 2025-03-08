import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741392105075 implements MigrationInterface {
    name = 'Migration1741392105075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('comment')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" character varying NOT NULL, "toId" character varying NOT NULL, "fromId" character varying NOT NULL, "type" "public"."notification_type_enum", "commentId" character varying NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_fafec2a7604ef9e0ccc328d7496" FOREIGN KEY ("toId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_3d1d1eefef4ce87fae858ff2bb5" FOREIGN KEY ("fromId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_8dcb425fddadd878d80bf5fa195" FOREIGN KEY ("commentId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_8dcb425fddadd878d80bf5fa195"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_3d1d1eefef4ce87fae858ff2bb5"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_fafec2a7604ef9e0ccc328d7496"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
    }

}
