import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoDto } from './create-todo.dto';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): any {
    return this.todoService.create(
      createTodoDto.title,
      createTodoDto.description,
    );
  }

  @Put()
  update(@Body() createTodoDto: CreateTodoDto): string {
    return 'this updates existing todo';
  }

  @Get()
  async findAll(): Promise<CreateTodoDto[]> {
    return this.todoService.findAllTodos();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CreateTodoDto> {
    return this.todoService.findOneTodo(id);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): string {
    return `This action removes a #${id} todo`;
  }
}
