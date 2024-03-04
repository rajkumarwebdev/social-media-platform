import { useState } from "react";
import { useProfile } from "../../../hooks/UserContext"
import "./imagepost.css";
import useIpProvider from "../../../hooks/useIpProvider";
const ImagePost = () => {
  const { currentUser } = useProfile();
  const [image, setImage] = useState("");
  const ip = useIpProvider()
  const handleGetImage = (e) => {
    const img = e.target.files[0];
    const acutualImage = URL.createObjectURL(img);
    setImage(acutualImage)
  }
  const handleImagePost = () => {
    //Store image in new db 
  }

  return (
    <div className="post-wrapper">
      <div className="image-post-container">
        <div className="image-post-heading">
          <p className="create-post-logo">Create New Post</p>
          <p className="image-post-btn" onClick={handleImagePost}>Post</p>
        </div>
        <div className="profile-show">
          <img className="image-post-image" src={currentUser.profilePic != "/images/userprofile.png" ? `http://${ip}/images/` + currentUser.profilePic : currentUser.profilePic} />
          <div className="image-post-username">{currentUser.name}</div>
        </div>

        <div className="Image-holder">
          <img className={`image-post-send ${image && "active"}`} src={image && image} alt="Choose image..." />
          <input onChange={(e) => handleGetImage(e)} className="image-upload-btn" style={{ opacity: image == "" && 10 }} type="file" accept="*png, .jpg, .jpeg" />
        </div>
        <div className="text-input-for-image">
          <textarea className="text-for-image" placeholder="Have something to share with the community?" required cols="30" rows="10"></textarea>
        </div>

        {/* <div className="image-share-btn"><button className="share-btn-image-section">Share</button></div> */}
      </div>

    </div>
  )
}

export default ImagePost  