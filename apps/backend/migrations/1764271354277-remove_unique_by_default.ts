import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueByDefault1764271354277 implements MigrationInterface {
    name = 'RemoveUniqueByDefault1764271354277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "llms" DROP CONSTRAINT "llms_default_tenant_type_unique"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "llms" ADD CONSTRAINT "llms_default_tenant_type_unique" UNIQUE ("default", "type", "tenant_id")`);
    }

}
