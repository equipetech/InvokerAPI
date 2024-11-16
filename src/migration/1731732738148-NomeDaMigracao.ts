import { MigrationInterface, QueryRunner } from "typeorm";

export class NomeDaMigracao1731732738148 implements MigrationInterface {
    name = 'NomeDaMigracao1731732738148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "usuarios" ADD "agua" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "agua"`);
    }

}
