import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateCustomersTable1595384453911 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(new Table({
        name: 'customers',
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
            name: 'email',
            type: 'varchar(256)',
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
      await queryRunner.dropTable('customers')
    }

}
