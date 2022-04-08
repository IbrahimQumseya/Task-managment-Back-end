import { MigrationInterface, QueryRunner } from 'typeorm';

export class asd21649425476355 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE TASK RENAME COLUMN "title" TO "name"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE TASK RENAME COLUMN "name" TO "title"`);
  }
}
