import { Comment, CommentSection, User } from './type'
import { formatDistanceToNow, differenceInDays } from 'date-fns';

export function formatDateToRelativeTime(dateTime: string | undefined): string {
  try {
    if (!dateTime) {
      return 'Date not provided';
    }

    const now = new Date();
    const date = new Date(dateTime);

    // Get the distance in days
    const distanceInDays = differenceInDays(now, date);

    if (distanceInDays >= 7 && distanceInDays <= 29) {
      // If the distance is 7 days or more, format it as weeks
      return `${Math.round(distanceInDays / 7)} weeks ago`;
    } else {
      // Otherwise, format it as usual
      return `${formatDistanceToNow(date)} ago`.replace('about', '').trim();
    }
  } catch (error) {
    console.error(error);
    return 'Invalid date';
  }
}

const isObject = (object: unknown): object is object => {
  return Boolean(object && typeof object === 'object');
};

const isString = (text: unknown): text is string => {
  return (typeof text === 'string' || text instanceof String) && text.trim().length !== 0;
};

export const parseCommentSection = (object: unknown): CommentSection => {
  if (!isObject(object)) {
    throw new Error('Incorrect or missing data');
  }

  if (
    'currentUser' in object &&
    'comments' in object
  ) {
    const commentSection: CommentSection = {
      currentUser: object.currentUser as User,
      comments: (object.comments as Comment[]).map(
        comment => parseComment(comment)
      ),
    };
    return commentSection
  }
  throw new Error('Incorrect data: a field missing');
}

const parseComment = (object: unknown): Comment => {
  if (!isObject(object)) {
    throw new Error('Incorrect or missing data');
  }

  if (
    'id' in object &&
    'content' in object &&
    'createdAt' in object &&
    'score' in object &&
    'user' in object
  ) {
    const newComment: Comment = {
      id: parseStringValue(object.id, 'id'),
      content: parseStringValue(object.content, 'content'),
      createdAt: parseStringValue(object.createdAt, 'createdAt'),
      score: parseScoreValue(object.score),
      user: object.user as User,
    };
    if ('replies' in object) {
      newComment.replies = (object.replies as Comment[]).map(
        comment => parseComment(comment)
      )
    }
    if ('replyingTo' in object) {
      newComment.replyingTo = parseStringValue(object.replyingTo, 'replyingTo')
    }
    return newComment
  }
  throw new Error('Incorrect data: a field missing');
}

const parseStringValue = (value: unknown, name: string): string => {
  if (!isString(value)) {
    throw new Error(`Incorrect or missing ${name}`);
  }

  return value;
}

const parseScoreValue = (value: unknown): number => {
  if (!Number.isInteger(value)) {
    throw new Error('Incorrect or missing score');
  }
  return parseInt(value as string);
}

export const getRepLyToFromContent = (content: string): [string | undefined, string] => {
  if (content.startsWith('@')) {
    const firstSpaceIndex = content.indexOf(' ');
    if (firstSpaceIndex === -1) {
      return [content.substring(1), ''];
    } else {
      return [content.substring(1, firstSpaceIndex), content.substring(firstSpaceIndex + 1)];
    }
  } else {
    return [undefined, content];
  }
}