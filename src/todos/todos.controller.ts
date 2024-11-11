import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, NotFoundException,
  Param, Patch,
  Post,
  Put,
} from '@nestjs/common'
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
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

  @Put(':id')
  update(
      @Param('id') id: number,
      @Body() updateTodoDto: UpdateTodoDto,
  ): any {
    const {title, description, completed} = updateTodoDto

    const requiredFields = [title, description, completed]

    if (requiredFields.some(item => item === undefined)) {
      throw new BadRequestException('Title, description and completed are required.')
    }

    return this.todoService.updateTodo(id, updateTodoDto);
  }

  @Patch(':id')
  partialUpdate(
      @Param('id') id: number,
      @Body() updateTodoDto: UpdateTodoDto,
  ): any {
    return this.todoService.updateTodo(id, updateTodoDto);
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
  deleteOne(@Param('id') id: number): any {
    return this.todoService.deleteTodo(id)
  }
}
