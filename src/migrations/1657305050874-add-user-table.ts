import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable implements MigrationInterface {
  name = 'AddUserTable1657305050874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
                            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                            "email" character varying NOT NULL, 
                            "password" character varying NOT NULL, 
                            "firstName" character varying NOT NULL, 
                            "lastName" character varying NOT NULL, 
                            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                            CONSTRAINT "UQ_user_email" UNIQUE ("email"), 
                            CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
                          )`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_email" ON "user" ("email") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_email"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
