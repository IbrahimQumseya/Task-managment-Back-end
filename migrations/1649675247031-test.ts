import { MigrationInterface, QueryRunner } from 'typeorm';

export class test1649675247031 implements MigrationInterface {
  name = 'test1649675247031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "test"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ADD "test" "char" array`);
  }
}
