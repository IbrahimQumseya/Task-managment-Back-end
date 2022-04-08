import { MigrationInterface, QueryRunner } from 'typeorm';

export class asd31649425596549 implements MigrationInterface {
  name = 'asd31649425596549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" RENAME COLUMN "name" TO "title"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" RENAME COLUMN "title" TO "name"`,
    );
  }
}
