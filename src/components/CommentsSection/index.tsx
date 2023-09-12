import Avatar from '../Avatar'
import Data from '../../data.json'
import Comment from '../comment'

function CommentsSection() {
  const data = Data
  return (
    <div className="comment-section">
      {
        data.comments.map(comment => (
          <Comment key={comment.id} {...comment} />
        ))
      }

      <div className="compose">
        <textarea name="compose-comment" placeholder="Add a comment..." />
        <Avatar username={data.currentUser.username} />
        <button>Send</button>
      </div>

    </div>
  )
}
export default CommentsSection