import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameTable implements MigrationInterface {
  name = 'AddGameTable1657366114641';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game" (
                                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                                    "name" character varying NOT NULL, 
                                    "gameId" character varying NOT NULL, 
                                    "userId" uuid NOT NULL,
                                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                                    CONSTRAINT "UQ_game_gameId" UNIQUE ("gameId"), 
                                    CONSTRAINT "PK_game_id" PRIMARY KEY ("id")
                                  )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_game_name_gameId" ON "game" ("name", "gameId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_game_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_game_name_gameId"`);
    await queryRunner.query(`DROP TABLE "game"`);
  }
}
