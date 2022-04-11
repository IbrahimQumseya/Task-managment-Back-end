import { MigrationInterface, QueryRunner } from 'typeorm';

export class asd1649425401583 implements MigrationInterface {
  name = 'asd1649425401583';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "test"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ADD "test" boolean`);
  }
}
