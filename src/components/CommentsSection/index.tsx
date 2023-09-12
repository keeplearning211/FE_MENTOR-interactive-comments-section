import Avatar from '../Avatar'

function CommentsSection() {
  return (
    <div className="comment-section">
      <div className="comment no-reply">
        <div className="author">
          <Avatar />
          <p className="name">name</p>
          <p className="timestamps"> 1 month ago</p>
        </div>
        <p className="content">
          Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You’ve nailed the design and the responsiveness at various breakpoints works really well.
        </p>
        <div className="score">
          <button className="add-btn" />
          12
          <button className="minus-btn" />
        </div>
        <div className="action">
          <button className="reply-btn"><i className="reply-icon"></i> Reply</button>
        </div>

      </div>

      <div className="comment">
        <div className="author">
          <Avatar />
          <p className="name">ramsesmiron</p>
          <p className="timestamps"> 1 week ago</p>
        </div>
        <p className="content">
          @maxblagun If you’re still new, I’d recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It’s very tempting to jump ahead but lay a solid foundation first.
        </p>
        <div className="score">
          <button className="add-btn" />
          12
          <button className="minus-btn" />
        </div>
        <div className="action">
          <button className="reply-btn"><i className="reply-icon"></i> Reply</button>
        </div>

        <div className="reply">
          <span className="line"></span>
          <div className="comments">
            <div className="comment">
              <div className="author">
                <Avatar />
                <p className="name">ramsesmiron</p>

                <p className="timestamps"> 2 days ago</p>
              </div>
              <p className="content">
                @maxblagun If you’re still new, I’d recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It’s very tempting to jump ahead but lay a solid foundation first.                </p>
              <div className="score">
                <button className="add-btn" />
                12
                <button className="minus-btn" />
              </div>
              <div className="action">
                <button className="reply-btn"><i className="reply-icon"></i> Reply</button>
              </div>
            </div>
            <div className="comment">
              <div className="author">
                <Avatar />
                <p className="name">juliusomo<span className="you-tag">You</span></p>

                <p className="timestamps"> 2 days ago</p>
              </div>
              <p className="content">Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You’ve nailed the design and the responsiveness at various breakpoints works really well.</p>
              <div className="score">
                <button className="add-btn" />
                12
                <button className="minus-btn" />
              </div>
              <div className="action">
                <button className="delete-btn"><i className="delete-icon"></i>Delete</button>
                <button className="edit-btn" ><i className="edit-icon"></i>Edit</button>
              </div>
            </div>

          </div>


        </div>

      </div>
      <div className="compose">
        <textarea name="compose-comment" placeholder="Add a comment..." />
        <Avatar />
        <button>Send</button>
      </div>

    </div>
  )
}

export default CommentsSection