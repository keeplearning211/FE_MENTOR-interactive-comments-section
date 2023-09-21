import amyrobsonImgSrc from '../../assets/images/avatars/image-amyrobson.png'
import juliusomoImgSrc from '../../assets/images/avatars/image-juliusomo.png'
import maxblagunImgSrc from '../../assets/images/avatars/image-maxblagun.png'
import ramsesmironImgSrc from '../../assets/images/avatars/image-ramsesmiron.png'
import defaultImgSrc from '../../assets/images/avatars/image-default.png'

function getAvatarSrc(username: string): string {
  switch (username) {
    case 'amyrobson':
      return amyrobsonImgSrc
    case 'juliusomo':
      return juliusomoImgSrc
    case 'maxblagun':
      return maxblagunImgSrc
    case 'ramsesmiron':
      return ramsesmironImgSrc
    default:
      return defaultImgSrc
  }
}

function Avatar({ username }: { username: string }) {
  const imgSrc = getAvatarSrc(username)
  return <img className="avatar" src={imgSrc} alt="avatar image" />

}

export default Avatar