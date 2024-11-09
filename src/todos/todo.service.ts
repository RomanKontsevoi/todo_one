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

  async findOneTodo(id: string): Promise<CreateTodoDto> {
    try {
      const [rows] = await this.db
          .execute('SELECT * FROM todos WHERE id = ?', [id]) as [CreateTodoDto[], any]

      // Check if any rows were returned
      if (rows.length === 0) {
        return null; // Return null if no todo found
      }

      return rows[0] as CreateTodoDto; // Return the first matching todo
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw new Error('Could not fetch todo'); // Handle error appropriately
    }
  }
}
