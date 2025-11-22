import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAndUpdateAtToAccount1763822304288 implements MigrationInterface {
    name = 'AddCreatedAndUpdateAtToAccount1763822304288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "updated_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "created_at" DROP DEFAULT`);
    }

}
