import { Dispatch, forwardRef, useEffect, useState } from 'react';
import Avatar from '../Avatar'
import { CommentActionType, Ref } from '../../type';
import { CommentSectionAction } from '../CommentsSection';
import { v1 as uuidv1 } from 'uuid';
import { getRepLyToFromContent } from '../../utils';


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

  useEffect(() => {
    if (replyingTo) {
      setValue(`@${replyingTo} `)
    }
  }, [replyingTo])

  const onClickHandler = () => {
    if (replying) {
      replyComment()
      return setReplying(false)
    }

    return sendComment()
  }

  const sendComment = () => {
    const newComment = {
      id: uuidv1(),
      content: value,
      createdAt: new Date().toISOString(),
      score: 0,
      replies: []
    }

    dispatch({
      type: CommentActionType.COMMENT,
      payload: newComment
    })
    return setValue('')
  }

  const replyComment = () => {
    const [replyingTo, content] = getRepLyToFromContent(value)
    const newReply = {
      id: uuidv1(),
      createdAt: new Date().toISOString(),
      score: 0,
      content,
      replyingTo,
      commentId: parentCommentId ? parentCommentId : commentId!,
    }

    dispatch({
      type: CommentActionType.REPLY,
      payload: newReply
    })
    return setValue('')
  }

  return (
    <div className="compose" ref={ref}>
      <textarea className="compose-comment" placeholder="Add a comment..." value={value} onChange={(e) => setValue(e.target.value)} autoFocus={replying} />
      <Avatar username={username} />
      <button onClick={onClickHandler}>{replying ? 'REPLY' : 'SEND'}</button>
    </div>
  )
})

export default Compose
