import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum NotificationType {
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  LIKE = 'LIKE',
  MENTION = 'MENTION',
  FOLLOW = 'FOLLOW',
}

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  recipientId: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  sourceId?: string;
}
