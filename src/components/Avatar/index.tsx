// import amyrobsonImgSrc from '../../assets/images/avatars/image-amyrobson.png'
// import juliusomoImgSrc from '../../assets/images/avatars/image-juliusomo.png'
// import maxblagunImgSrc from '../../assets/images/avatars/image-maxblagun.png'
// import ramsesmironImgSrc from '../../assets/images/avatars/image-ramsesmiron.png'
// import defaultImgSrc from '../../assets/images/avatars/image-default.png'

// function getAvatarSrc(username: string): string {
//   switch (username) {
//     case 'amyrobson':
//       return amyrobsonImgSrc
//     case 'juliusomo':
//       return juliusomoImgSrc
//     case 'maxblagun':
//       return maxblagunImgSrc
//     case 'ramsesmiron':
//       return ramsesmironImgSrc
//     default:
//       return defaultImgSrc
//   }
// }

// function Avatar({ username, size = 32 }: { username: string, size?: number }) {
//   const imgSrc = getAvatarSrc(username)
//   return <img className="avatar" src={imgSrc} alt="avatar image" width={size} height={size} />

// }

function Avatar({ username }: { username: string }) {
  return <i className="avatar" data-username={username}></i>
}

export default Avatar