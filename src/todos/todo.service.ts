import { Injectable, Inject } from '@nestjs/common'
import { Pool } from 'mysql2/promise'
import { CreateTodoDto } from 'src/todos/create-todo.dto'

@Injectable()
export class TodoService {
  constructor(@Inject('DATABASE_CONNECTION') private db: Pool) {
    this.createTable()
  }

  private async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await this.db.execute(createTableQuery)
    console.log('Table "todos" has been created or already exists.')
  }

  async create(title: string, description: string): Promise<any> {
    const [result] = await this.db.execute('INSERT INTO todos (title, description) VALUES (?, ?)', [
      title,
      description,
    ])
    return result
  }

  async findAllTodos(): Promise<CreateTodoDto[]> {
    const [rows] = await this.db.query('SELECT * FROM todos')
    return rows as CreateTodoDto[]
  }
}
