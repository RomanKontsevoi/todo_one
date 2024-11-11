import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { Pool, ResultSetHeader } from 'mysql2/promise'
import { CreateTodoDto } from 'src/todos/create-todo.dto'
import { UpdateTodoDto } from 'src/todos/update-todo.dto'

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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await this.db.execute(createTableQuery)
    console.log('Table "todos" has been created or already exists.')
  }

  async create(title: string, description: string): Promise<any> {
    const [result] = await this.db.execute<ResultSetHeader>(
      'INSERT INTO todos (title, description, completed, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [title, description, false]
    )
    return { id: result.insertId, title, description, completed: false, ...result }
  }

  async findAllTodos(): Promise<CreateTodoDto[]> {
    const [rows] = await this.db.query('SELECT * FROM todos')
    return (rows as CreateTodoDto[]).map((row: any) => ({
      ...row,
      completed: Boolean(row.completed),
    })) as CreateTodoDto[];
  }

  async findOneTodo(id: string): Promise<CreateTodoDto> {
    try {
      const [rows] = (await this.db.execute('SELECT * FROM todos WHERE id = ?', [id])) as [
        CreateTodoDto[],
        any,
      ]

      if (rows.length === 0) {
        return null // Return null if no todo found
      }

      const [row] = rows

      return {
        ...row,
        completed: Boolean(row.completed),
      } as CreateTodoDto
    } catch (error) {
      console.error('Error fetching todo:', error)
      throw new Error('Could not fetch todo')
    }
  }

  async updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<any> {
    const { title, description, completed } = updateTodoDto

    const fieldsArr = [{ title }, { description }, { completed }]
    const fieldsArrFiltered = fieldsArr.filter((item) => Object.values(item)[0] !== undefined)
    const setFields = fieldsArrFiltered
      .map((item) => {
        const [key] = Object.keys(item)
        return `${key} = ?`
      })
      .join(', ')

    const query = `UPDATE todos SET ${setFields}, updated_at = NOW() WHERE id = ?`

    console.log(query)

    const fieldValues = fieldsArrFiltered.map((item) => Object.values(item)[0])

    const [result] = await this.db.execute<ResultSetHeader>(query, [...fieldValues, id])

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }

    return { message: 'Todo updated successfully' }
  }

  async deleteTodo(id: number): Promise<any> {
    const [result] = await this.db.execute<ResultSetHeader>('DELETE FROM todos WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }

    return { message: 'Todo deleted successfully' }
  }
}
