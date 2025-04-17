export enum NotificationType {
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  LIKE = 'LIKE',
  MENTION = 'MENTION',
  FOLLOW = 'FOLLOW',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  sourceId?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
