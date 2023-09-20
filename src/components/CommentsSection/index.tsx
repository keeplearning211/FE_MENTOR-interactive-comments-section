import { useEffect } from 'react'
import dataServices, { COMMENT_SECTION_DATA } from '../../dataServices'
import { Comment as CommentType, CommentActionType, CommentSection, User } from '../../type'
import Comment, { CommentProps } from '../comment'
import Compose from '../Compose'
import { useImmerReducer } from 'use-immer'


type CommentSectionState = CommentSection | {
  currentUser: { username: string },
  comments: CommentType[]
}

type SetCommentSectionAction = {
  type: CommentActionType.SET_COMMENT_SECTION,
  payload: CommentSection
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies?: Comment[];
  replyingTo?: string;
}

type CommentAction = {
  type: CommentActionType.COMMENT,
  payload: Omit<CommentType, 'user'>
}

type ReplyAction = {
  type: CommentActionType.REPLY,
  payload: Omit<CommentType, 'user'> & {
    commentId: string
  }
}

type EditAction = {
  type: CommentActionType.EDIT,
  payload: {
    isReply: false,
    commentId: string,
    replyId?: string
    replyingTo?: string,
    content: string,
    createdAt: string
  } | {
    isReply: true,
    commentId: string,
    replyId: string,
    content: string,
    replyingTo?: string,
    createdAt: string,
  }
}

type DeleteAction = {
  type: CommentActionType.DELETE,
  payload: {
    isReply: false,
    commentId: string,
    replyId?: string
  } | {
    isReply: true,
    replyId: string,
    commentId?: string
  }
}
type VoteAction = {
  type: CommentActionType.VOTE,
  payload: {
    isUpVote?: boolean
    isReply: false,
    commentId: string,
    replyId?: string
  } | {
    isReply: true,
    isUpVote?: boolean
    replyId: string
    commentId: string
  }
}

export type CommentSectionAction =
  SetCommentSectionAction | VoteAction | CommentAction | ReplyAction | EditAction | DeleteAction

function commentSectionReducer(draft: CommentSectionState, action: CommentSectionAction) {
  switch (action.type) {
    case CommentActionType.SET_COMMENT_SECTION: {
      return action.payload
    }
    case CommentActionType.COMMENT: {
      const newComment: CommentType = {
        ...action.payload,
        user: draft.currentUser,
      };
      draft.comments.push(newComment);
      break;
    }
    case CommentActionType.REPLY: {
      const { commentId } = action.payload;
      const newComment: CommentType = {
        ...action.payload,
        user: draft.currentUser,
      };
      const parentComment = draft.comments.find((comment) => comment.id === commentId);
      if (parentComment) {
        parentComment.replies?.push(newComment);
      }
      break;
    }
    case CommentActionType.EDIT: {
      const { isReply, commentId, content, replyingTo, createdAt } = action.payload;
      if (isReply) {
        const parentComment = draft.comments.find((comment) => comment.id === commentId)
        if (parentComment) {
          const reply = parentComment.replies?.find(reply => reply.id === action.payload.replyId)
          if (reply) {
            reply.content = content
            reply.replyingTo = replyingTo
            reply.createdAt = createdAt
          }
        }
      } else {
        const comment = draft.comments.find((comment) => comment.id === commentId)
        if (comment) {
          comment.content = content
          comment.createdAt = createdAt
        }
      }
      break
    }
    case CommentActionType.DELETE: {
      const { isReply, commentId, replyId } = action.payload
      if (isReply) {
        const parentComment = draft.comments.find((comment) => comment.id === commentId)
        if (parentComment) {
          parentComment.replies = parentComment.replies?.filter(reply => reply.id !== replyId)
        }
      } else {
        draft.comments = draft.comments.filter((comment) => comment.id !== commentId)
      }

      break
    }
    case CommentActionType.VOTE: {
      const { isReply, isUpVote } = action.payload;
      if (!isReply) { // vote for comment
        const comment = draft.comments.find((comment) => comment.id === action.payload.commentId);
        if (comment) {
          comment.score += isUpVote ? 1 : -1;
        }
        // sort comments base on their score
        draft.comments.sort((comment1, comment2) => comment2.score - comment1.score)

      } else { // vote for reply
        const comment = draft.comments.find((comment) => comment.id === action.payload.commentId);
        if (comment && comment.replies) {
          const reply = comment.replies.find((reply) => reply.id === action.payload.replyId);
          if (reply) {
            reply.score += isUpVote ? 1 : -1;
          }
        }
      }
      break;
    }
    default:
      break;
  }
}

function CommentsSection() {
  const [state, dispatch] = useImmerReducer(commentSectionReducer, {
    currentUser: { username: '' },
    comments: [] as CommentType[],
  })
  const data: CommentSection | null = dataServices.getCommentSection()

  useEffect(() => {
    if (data) {
      dispatch({
        type: CommentActionType.SET_COMMENT_SECTION,
        payload: data
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // save the current state of comment section to local storage
  useEffect(() => {
    if (state.currentUser.username) {
      localStorage.setItem(COMMENT_SECTION_DATA, JSON.stringify(state));
    }
  }, [state])

  return (
    <div className="comment-section">
      {
        state?.comments.map(comment => {
          const commentProps: CommentProps = {
            ...comment,
            currentUser: state.currentUser.username,
            dispatch: dispatch,
            isReply: false
          } as CommentProps
          return (
            <Comment key={comment.id} {...commentProps} />
          )
        })
      }
      <Compose dispatch={dispatch} replying={false} username={state.currentUser.username} />
    </div>
  )
}
export default CommentsSection