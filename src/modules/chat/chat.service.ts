import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { apiSuccess } from 'src/common/dto/api-response';
import { AuthenUser } from 'src/modules/auth/dto/authen-user.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createChatDto: CreateChatDto, user: AuthenUser) {
    console.log(createChatDto);
    const newChat = await this.prismaService.chat.create({
      data: {
        discussionId: createChatDto.discussionId,
        message: createChatDto.message,
        senderId: user.userId,
      },
    });
    return apiSuccess(HttpStatus.CREATED, newChat, 'Chat created successfully');
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}