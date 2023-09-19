import { useRef, useState, useEffect, Dispatch } from 'react';
import Avatar from '../Avatar';
import { CommentActionType, User } from '../../type';
import Compose from '../Compose';
import DeleteConfirmModal from '../DeleteConfirmModal';
import { CommentSectionAction } from '../CommentsSection';
import { formatDateToRelativeTime, getRepLyToFromContent } from '../../utils';

export interface CommentProps {
  id: string;
  content: string;
  createdAt: string;
  score: number;
  user: User
  replies?: CommentProps[];
  replyingTo?: string;
  isReply: boolean;
  currentUser: string,
  dispatch: Dispatch<CommentSectionAction>
  parentCommentId?: string
}

function Comment({ id, parentCommentId, content, user, score, createdAt, replies, replyingTo = '', isReply, currentUser, dispatch }: CommentProps) {
  const [replying, setReplying] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatingCommentValue, setUpdatingCommentValue] = useState<string>(`${replyingTo ? `@${replyingTo} ` : ''}${content}`)

  const hasReplies = replies && replies.length > 0;
  const formattedDate = formatDateToRelativeTime(createdAt)

  const handleReplyClick = () => {
    setReplying(true)
  }

  const handleOutsideComposeClick = (event: Event) => {
    if (composeRef.current && !(composeRef.current as HTMLDivElement).contains(event.target as HTMLDivElement)) {
      setReplying(false)
    }
  }

  const composeRef = useRef(null)
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideComposeClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideComposeClick)
    }
  }, [composeRef])

  const handleConfirmDelete = () => {
    if (isReply) {
      dispatch({
        type: CommentActionType.DELETE,
        payload: {
          isReply: true,
          commentId: parentCommentId,
          replyId: id
        }
      })
    } else {
      dispatch({
        type: CommentActionType.DELETE,
        payload: {
          isReply: false,
          commentId: id,
        }
      })
    }
    setIsModalOpen(false)
  }

  const handleCloseConfirmModal = () => {
    setIsModalOpen(false)
  }

  const handleClickDelete = () => {
    setIsModalOpen(true)
  }

  const handleUpdatingComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatingCommentValue(e.target?.value)
  }

  const handleUpdate = () => {
    setIsUpdating(false)
    if (isReply) {
      const [replyingTo, content] = getRepLyToFromContent(updatingCommentValue)
      return dispatch({
        type: CommentActionType.EDIT,
        payload: {
          isReply: true,
          commentId: parentCommentId!,
          replyId: id,
          content: content,
          replyingTo: replyingTo,
          createdAt: new Date().toISOString()
        }
      })
    }

    return dispatch({
      type: CommentActionType.EDIT,
      payload: {
        isReply: false,
        commentId: id,
        content: updatingCommentValue,
        createdAt: new Date().toISOString()
      }
    })

  }

  const handleVote = (isUpVote: boolean) => {
    if (isReply) {
      return dispatch({
        type: CommentActionType.VOTE,
        payload: {
          replyId: id,
          commentId: parentCommentId!,
          isReply: true,
          isUpVote: isUpVote,
        }
      })
    }

    dispatch({
      type: CommentActionType.VOTE,
      payload: {
        isUpVote: isUpVote,
        isReply: false,
        commentId: id,
      }
    })
  }

  return (
    <>
      <div className={`comment${hasReplies ? ' has-replies' : ''}${replying ? ' replying' : ''}`}>
        <div className="author">
          <Avatar username={user?.username} />
          <p className="name">
            {user?.username}
            {currentUser === user?.username && <span className="you-tag">You</span>}
          </p>
          <p className="timestamps">{formattedDate}</p>
        </div>
        {
          isUpdating ?
            <textarea
              className="update-comment"
              value={updatingCommentValue}
              onChange={handleUpdatingComment}
              autoFocus
            /> :
            <p className="content">
              {replyingTo && <span className="replying-to">@{replyingTo}</span>} {content}
            </p>
        }
        <div className="score">
          <button className="add-btn" onClick={() => handleVote(true)} />
          <span>{score}</span>
          <button className="minus-btn" onClick={() => handleVote(false)} />
        </div>
        <div className={`action${isUpdating ? ' isUpdating' : ' hidden'}`}>
          <button className="update-comment-btn" onClick={handleUpdate}>UPDATE</button>
        </div>
        <div className={`action${isUpdating ? ' hidden' : ''}`}>
          {
            currentUser !== user?.username ?
              <button className="reply-btn" onClick={handleReplyClick}><i className="reply-icon"></i> Reply</button> :
              <>
                <button className="delete-btn" onClick={handleClickDelete}><i className="delete-icon"></i>Delete</button>
                <button className="edit-btn" onClick={() => setIsUpdating(!isUpdating)}><i className="edit-icon"></i>Edit</button>
              </>
          }
        </div>
        {
          hasReplies && (
            <div className="reply">
              <span className="line"></span>
              <div className="comments">
                {
                  replies.map((comment) => (
                    <Comment key={comment.id}
                      {...comment}
                      isReply={true}
                      currentUser={currentUser}
                      dispatch={dispatch}
                      parentCommentId={id}
                    />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          replying &&
          <Compose
            ref={composeRef}
            replying={replying}
            commentId={id} parentCommentId={parentCommentId!}
            username={currentUser}
            replyingTo={user?.username}
            dispatch={dispatch}
            setReplying={setReplying}
          />
        }
      </div>
      {isModalOpen && <DeleteConfirmModal
        title="Delete comment"
        message="Are you sure you want to delete this comment? This will remove the comment and can’t be undone."
        onConfirm={handleConfirmDelete}
        onClose={handleCloseConfirmModal}
        isOpen={isModalOpen} />}
    </>
  )
}

export default Comment