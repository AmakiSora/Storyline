import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class InitialSchema1717500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建 persons 表
    await queryRunner.createTable(
      new Table({
        name: 'persons',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'color',
            type: 'varchar',
            length: '20',
            default: "'#0ea5e9'",
          },
          {
            name: 'icon',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isUpdateDate: true,
          },
        ],
      }),
      true,
    )

    // 创建 events 表
    await queryRunner.createTable(
      new Table({
        name: 'events',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'image',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ["'album'", "'concert'", "'award'", "'milestone'", "'custom'"],
            default: "'custom'",
          },
          {
            name: 'personId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isUpdateDate: true,
          },
        ],
      }),
      true,
    )

    // 添加外键约束
    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['personId'],
        referencedTableName: 'persons',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    )

    // 创建索引
    await queryRunner.createIndex('events', 'IDX_events_date', ['date'])
    await queryRunner.createIndex('events', 'IDX_events_personId', ['personId'])
    await queryRunner.createIndex('events', 'IDX_events_type', ['type'])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('events')
    await queryRunner.dropTable('persons')
  }
}
