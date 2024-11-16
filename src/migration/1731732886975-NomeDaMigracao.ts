import { MigrationInterface, QueryRunner } from "typeorm";

export class NomeDaMigracao1731732886975 implements MigrationInterface {
    name = 'NomeDaMigracao1731732886975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "agua"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "localizacao"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "localizacao" point`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "localizacao"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "localizacao" text`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "agua" point`);
    }

}
