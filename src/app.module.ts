import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TodoService } from './todos/todo.service'
import { TodosController } from './todos/todos.controller'
import { DatabaseModule } from './database/database.module'

@Module({
    imports: [DatabaseModule],
    controllers: [AppController, TodosController],
    providers: [AppService, TodoService],
})
export class AppModule {}
