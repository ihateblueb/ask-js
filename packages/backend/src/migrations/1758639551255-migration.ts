import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1758639551255 implements MigrationInterface {
    name = 'Migration1758639551255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banned_ip" ("id" character varying NOT NULL, "ip" character varying NOT NULL, "userId" character varying, "reason" character varying, CONSTRAINT "PK_d594d7896b781126327e457e84a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ask_mod_info" ("id" character varying NOT NULL, "ip" character varying NOT NULL, "userId" character varying, CONSTRAINT "PK_a4f6febc931551795b8fa177257" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ask_mod_info"`);
        await queryRunner.query(`DROP TABLE "banned_ip"`);
    }

}
