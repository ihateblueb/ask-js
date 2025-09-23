import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1758641266698 implements MigrationInterface {
    name = 'Migration1758641266698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banned_sender" ("id" character varying NOT NULL, "toId" character varying NOT NULL, "ip" character varying, "userId" character varying, CONSTRAINT "PK_c8dc0b31094821d6e80241e41af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "banned_ip" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "banned_sender" ADD CONSTRAINT "FK_bb5eeccdb4c42ede5f1b768d9bf" FOREIGN KEY ("toId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "banned_sender" ADD CONSTRAINT "FK_516de3e54d4968dad8b8357359f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banned_sender" DROP CONSTRAINT "FK_516de3e54d4968dad8b8357359f"`);
        await queryRunner.query(`ALTER TABLE "banned_sender" DROP CONSTRAINT "FK_bb5eeccdb4c42ede5f1b768d9bf"`);
        await queryRunner.query(`ALTER TABLE "banned_ip" ADD "userId" character varying`);
        await queryRunner.query(`DROP TABLE "banned_sender"`);
    }

}
