import Data from '../../data.json'
import Comment from '../comment'
import Compose from '../Compose'

function CommentsSection() {
  const data = Data
  return (
    <div className="comment-section">
      {
        data.comments.map(comment => (
          <Comment key={comment.id} {...comment} />
        ))
      }
      <Compose replying={false} username={data.currentUser.username} />
    </div>
  )
}
export default CommentsSection