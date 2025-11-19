import avatar from "../assets/avatar.png";

const getPicture = (userId: number) =>
{
  try {
    return `http://localhost:5005/Pictures/UserPfp/${userId}.png`;
  } catch (error) {
    return avatar;
  }
}

const ProfilePicture = ({userId, className}: {userId: number, className: string}) => {

  const picture = getPicture(userId);

  return (
    <img src={picture} onError={(e) => e.currentTarget.src = avatar} className={className}/>
  )
}

export default ProfilePicture