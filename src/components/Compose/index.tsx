import { forwardRef } from 'react';
import Avatar from '../Avatar'
import { Ref } from '../../type';

interface ComposePros {
  username: string;
  replying: boolean
}


const Compose = forwardRef<Ref, ComposePros>(function Compose({ username, replying }, ref) {
  return (
    <div className="compose" ref={ref}>
      <textarea className="compose-comment" placeholder="Add a comment..." autoFocus />
      <Avatar username={username} />
      <button>{replying ? 'REPLY' : 'SEND'}</button>
    </div>
  )
})

export default Compose