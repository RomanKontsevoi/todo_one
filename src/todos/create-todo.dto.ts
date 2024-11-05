export class CreateTodoDto {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at?: string;
}
