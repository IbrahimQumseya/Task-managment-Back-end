import { MigrationInterface, QueryRunner } from 'typeorm';

export class test11649675466383 implements MigrationInterface {
  name = 'test11649675466383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "test" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "test"`);
  }
}
