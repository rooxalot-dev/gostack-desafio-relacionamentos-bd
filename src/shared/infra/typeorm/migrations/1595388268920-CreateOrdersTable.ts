import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateOrdersTable1595388268920 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'orders',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'customer_id',
          type: 'uuid',
          isNullable: true,
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
    }));

    await queryRunner.createForeignKey('orders', new TableForeignKey({
      name: 'order_customer',
      columnNames: ['customer_id'],
      referencedTableName: 'customers',
      referencedColumnNames: ['id']
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('orders', 'order_customer');

    await queryRunner.dropTable('orders')
  }

}
