import { useProfile } from "../../../hooks/UserContext"
import "./imagepost.css";
const ImagePost = () => {
  const { currentUser } = useProfile();
  return (
    <div className="post-wrapper">
      <div className="image-post-container">
        <div className="image-post-heading">
          <p>Create New Post</p>
          <p>Post</p>
        </div>
        <div className="profile-show">
          <img className="image-post-image" src={currentUser.profilePic != "/images/userprofile.png" ? "http://192.168.43.249:3001/images/" + currentUser.profilePic : currentUser.profilePic} />
          <div className="image-post-username">{currentUser.name}</div>
        </div>

        <div className="Image-holder">
          <img className="image-post-send" src={currentUser.profilePic != "/images/userprofile.png" ? "http://192.168.43.249:3001/images/" + currentUser.profilePic : currentUser.profilePic} />
          <input className="image-upload-btn" type="file" accept="*png, .jpg, .jpeg" />
        </div>
        <div className="text-input-for-image">
          <textarea className="text-for-image" placeholder="Have something to share with the community?" required cols="30" rows="10"></textarea>
        </div>

        <div className="image-share-btn"><button>Share</button></div>
      </div>

    </div>
  )
}

export default ImagePost  