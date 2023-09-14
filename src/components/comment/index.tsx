import { useRef, useState, useEffect } from 'react';
import Avatar from '../Avatar';
import { User } from '../../type';
import Data from '../../data.json';
import Compose from '../Compose';
import DeleteConfirmModal from '../DeleteConfirmModal';

interface CommentProps {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User
  replies: CommentProps[];
  replyingTo?: string;
  isReply?: boolean;
  replyHandler?: () => void;
}

function Comment({ content, user, score, createdAt, replies, replyingTo = '', isReply, replyHandler }: CommentProps) {
  const [replying, setReplying] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { currentUser: { username: currentUser } } = Data
  const hasReplies = replies?.length > 0;

  const replyClickHandler = () => {
    if (isReply && replyHandler) return replyHandler()
    setReplying(true)
  }

  const outSideComposeClickHandler = (event: Event) => {
    if (composeRef.current && !(composeRef.current as HTMLDivElement).contains(event.target as HTMLDivElement)) {
      setReplying(false)
    }
  }

  const composeRef = useRef(null)
  useEffect(() => {
    document.addEventListener('mousedown', outSideComposeClickHandler)

    return () => {
      document.removeEventListener('mousedown', outSideComposeClickHandler)
    }
  }, [composeRef])

  const confirmDeleteHandler = () => {
    setIsModalOpen(false)
  }

  const closeConfirmModalHandler = () => {
    setIsModalOpen(false)
  }

  const onClickDeleteHandler = () => {
    setIsModalOpen(true)
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
          <p className="timestamps">{createdAt}</p>
        </div>
        <p className="content">
          {replyingTo && <span className="replying-to">@{replyingTo}</span>} {content}
        </p>
        <div className="score">
          <button className="add-btn" />
          {score}
          <button className="minus-btn" />
        </div>
        <div className="action">
          {
            currentUser !== user?.username ?
              <button className="reply-btn" onClick={replyClickHandler}><i className="reply-icon"></i> Reply</button> :
              <>
                <button className="delete-btn" onClick={onClickDeleteHandler}><i className="delete-icon"></i>Delete</button>
                <button className="edit-btn"><i className="edit-icon"></i>Edit</button>
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
                      replyHandler={replyClickHandler}
                    />
                  ))
                }
              </div>
            </div>
          )
        }
        {replying && <Compose ref={composeRef} replying={replying} username={currentUser} />}
      </div>
      {isModalOpen && <DeleteConfirmModal
        title="Delete comment"
        message="Are you sure you want to delete this comment? This will remove the comment and can’t be undone."
        onConfirm={confirmDeleteHandler}
        onClose={closeConfirmModalHandler}
        isOpen={isModalOpen} />}
    </>
  )
}

export default Comment