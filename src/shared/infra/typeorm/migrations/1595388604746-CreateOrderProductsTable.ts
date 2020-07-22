import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateOrderProductsTable1595388604746 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'orders_products',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'order_id',
          type: 'uuid',
          isNullable: false,
        },
        {
          name: 'product_id',
          type: 'uuid',
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
    }));

    await queryRunner.createForeignKey('orders_products', new TableForeignKey({
      name: 'order_products_order',
      columnNames: ['order_id'],
      referencedTableName: 'orders',
      referencedColumnNames: ['id']
    }));

    await queryRunner.createForeignKey('orders_products', new TableForeignKey({
      name: 'order_products_product',
      columnNames: ['product_id'],
      referencedTableName: 'products',
      referencedColumnNames: ['id']
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('orders_products', 'order_products_order');

    await queryRunner.dropForeignKey('orders_products', 'order_products_product');

    await queryRunner.dropTable('orders_products');
  }

}
