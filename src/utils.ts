import { Comment, CommentSection, User } from './type';
import { formatDistanceToNow, differenceInDays } from 'date-fns';

/**
 * Formats a date to a relative time string.
 */
export function formatDateToRelativeTime(dateTime: string | undefined): string {
  if (!dateTime) {
    return 'Date not provided';
  }

  try {
    const now = new Date();
    const date = new Date(dateTime);
    const distanceInDays = differenceInDays(now, date);

    if (distanceInDays >= 7 && distanceInDays <= 13) {
      return `${Math.round(distanceInDays / 7)} week ago`;
    } else if (distanceInDays >= 14 && distanceInDays <= 29) {
      return `${Math.round(distanceInDays / 7)} weeks ago`;
    } else {
      return `${formatDistanceToNow(date)} ago`.replace('about', '').trim();
    }
  } catch (error) {
    console.error(error);
    return 'Invalid date';
  }
}

/**
 * Type guards for object and string.
 */
const isObject = (object: unknown): object is Record<string, unknown> => typeof object === 'object' && object !== null;
export const isString = (text: unknown): text is string => typeof text === 'string' && text.trim().length !== 0;

/**
 * Parses a value as a string, throwing an error if it's not a string.
 */
const parseStringValue = (value: unknown, name: string): string => {
  if (!isString(value)) {
    throw new Error(`Incorrect or missing ${name}`);
  }
  return value;
};

/**
 * Parses a value as a score, throwing an error if it's not an integer.
 */
const parseScoreValue = (value: unknown): number => {
  if (!Number.isInteger(value)) {
    throw new Error('Incorrect or missing score');
  }
  return value as number;
};

/**
 * Parses an object as a comment, throwing an error if it's missing required fields.
 */
const parseComment = (object: unknown): Comment => {
  if (!isObject(object) || !('id' in object && 'content' in object && 'createdAt' in object && 'score' in object && 'user' in object)) {
    throw new Error('Incorrect or missing data');
  }

  const newComment: Comment = {
    id: parseStringValue(object.id, 'id'),
    content: parseStringValue(object.content, 'content'),
    createdAt: parseStringValue(object.createdAt, 'createdAt'),
    score: parseScoreValue(object.score),
    user: object.user as User,
  };

  if ('replies' in object) {
    newComment.replies = (object.replies as Comment[]).map(parseComment);
  }

  if ('replyingTo' in object) {
    newComment.replyingTo = parseStringValue(object.replyingTo, 'replyingTo');
  }

  return newComment;
};

/**
 * Parses an object as a comment section, throwing an error if it's missing required fields.
 */
export const parseCommentSection = (object: unknown): CommentSection => {
  if (!isObject(object) || !('currentUser' in object && 'comments' in object)) {
    throw new Error('Incorrect or missing data');
  }

  return {
    currentUser: object.currentUser as User,
    comments: (object.comments as Comment[]).map(parseComment),
  };
};

/**
 * Extracts a reply-to username and the rest of the content from a content string.
 */
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
};