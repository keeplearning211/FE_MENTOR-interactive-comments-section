import Avatar from '../Avatar';
import { User } from '../../type';
import Data from '../../data.json';

interface CommentProps {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User
  replies: CommentProps[];
  replyingTo: string;
}

function Comment({ content, user, score, createdAt, replies, replyingTo = '' }: CommentProps) {
  const { currentUser: { username: currentUser } } = Data
  const hasReply = replies?.length > 0;
  return (
    <div className={`comment ${hasReply ? '' : 'no-reply'}`}>
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
            <button className="reply-btn"><i className="reply-icon"></i> Reply</button> :
            <>
              <button className="delete-btn"><i className="delete-icon"></i>Delete</button>
              <button className="edit-btn"><i className="edit-icon"></i>Edit</button>
            </>
        }
      </div>
      {
        hasReply && (
          <div className="reply">
            <span className="line"></span>
            <div className="comments">
              {
                replies.map(comment => (
                  <Comment key={comment.id}
                    {...comment}
                  />
                ))
              }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Comment