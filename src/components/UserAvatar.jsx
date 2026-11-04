import { getInitials, useProfile } from '../context/ProfileContext'

export default function UserAvatar({ size = 32, photo, name, className = '' }) {
  const { profile } = useProfile()
  const currentPhoto = photo !== undefined ? photo : profile.photo
  const currentName = name !== undefined ? name : profile.name

  const style = { width: size, height: size }

  if (currentPhoto) {
    return (
      <img
        src={currentPhoto}
        alt={`Foto de ${currentName}`}
        style={style}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      style={{ ...style, fontSize: Math.max(10, Math.round(size * 0.36)) }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-white ${className}`}
    >
      {getInitials(currentName)}
    </span>
  )
}