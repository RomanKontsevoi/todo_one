import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { TodoService } from './todos/todo.service'
import { TodosController } from './todos/todos.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.local' : '.env',
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [AppController, TodosController],
  providers: [AppService, TodoService],
})
export class AppModule {}
