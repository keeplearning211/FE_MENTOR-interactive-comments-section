import { Dispatch, forwardRef, useEffect, useState } from 'react';
import Avatar from '../Avatar'
import { CommentActionType, Ref } from '../../type';
import { CommentSectionAction } from '../CommentsSection';
import { v1 as uuidv1 } from 'uuid';
import { getRepLyToFromContent, isString } from '../../utils';


type ComposePros = {
  username: string;
  dispatch: Dispatch<CommentSectionAction>
  replying: true,
  commentId: string,
  replyingTo: string
  parentCommentId: string
  setReplying: Dispatch<React.SetStateAction<boolean>>
} | {
  username: string;
  dispatch: Dispatch<CommentSectionAction>
  replying: false,
  commentId?: string,
  replyingTo?: string,
  parentCommentId?: string,
  setReplying?: Dispatch<React.SetStateAction<boolean>>
}

const Compose = forwardRef<Ref, ComposePros>(function Compose({ username, replying, dispatch, commentId, replyingTo, parentCommentId, setReplying }, ref) {
  const [value, setValue] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (replyingTo) {
      setValue(`@${replyingTo} `)
    }
  }, [replyingTo])

  const onClickHandler = () => {
    if (replying) {
      return replyComment()
    }

    return sendComment()
  }

  const sendComment = () => {
    if (!isString(value)) {
      return setValidationError('what do you want to comment?')
    }
    const newComment = {
      id: uuidv1(),
      content: value,
      createdAt: new Date().toISOString(),
      score: 0,
      replies: []
    }
    setValidationError(null)
    dispatch({
      type: CommentActionType.COMMENT,
      payload: newComment
    })

    return setValue('')
  }

  const replyComment = () => {
    const [replyingTo, content] = getRepLyToFromContent(value)
    if (!isString(content)) {
      return setValidationError('what do you want to comment?')
    }
    const newReply = {
      id: uuidv1(),
      createdAt: new Date().toISOString(),
      score: 0,
      content,
      replyingTo,
      commentId: parentCommentId ? parentCommentId : commentId!,
    }
    setValidationError(null)
    dispatch({
      type: CommentActionType.REPLY,
      payload: newReply
    })
    replying && setReplying(false)
    return setValue('')
  }

  return (
    <div className="compose" ref={ref}>
      <div className="compose-comment-wrapper">
        <textarea className={`compose-comment${validationError ? ' error' : ''}`} placeholder="Add a comment..." value={value} onChange={(e) => setValue(e.target.value)} autoFocus={replying} />
        {validationError && <span className="error-message">{validationError}</span>}
      </div>
      <Avatar username={username} />
      <button aria-label="send button" onClick={onClickHandler}>{replying ? 'REPLY' : 'SEND'}</button>
    </div>
  )
})

export default Compose
