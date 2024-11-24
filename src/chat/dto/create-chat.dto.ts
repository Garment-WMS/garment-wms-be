import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  discussionId: string;
  @IsNotEmpty()
  message: string;
}
