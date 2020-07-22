import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductsTable1595386046784 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'products',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'name',
          type: 'varchar(256)',
          isNullable: false,
        },
        {
          name: 'price',
          type: 'decimal',
          precision: 9,
          scale: 2,
          isNullable: false,
        },
        {
          name: 'quantity',
          type: 'int',
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamp with time zone',
          default: 'NOW()'
        },
        {
          name: 'updated_at',
          type: 'timestamp with time zone',
          default: 'NOW()'
        },
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('products')
  }

}
