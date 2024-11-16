import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsuariosTable1731769886192 implements MigrationInterface {
    name = 'CreateUsuariosTable1731769886192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "email" character varying NOT NULL, "senha_hash" character varying NOT NULL, "biografia" character varying, "localizacao" point, "avatar_url" character varying, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
