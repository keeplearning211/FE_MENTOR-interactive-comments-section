
function Avatar({ username }: { username: string }) {
  return <img className="avatar" src={`src/assets/images/avatars/image-${username ?? 'default'}.png`} />

}

export default Avatar