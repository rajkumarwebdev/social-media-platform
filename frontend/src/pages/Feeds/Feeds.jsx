import { useEffect, useState, useRef } from "react";
import "./feeds.css";
import { v4 } from "uuid";
import {
  handleLike,
  handleComment,
  handlePostComment,
  handleUpdateComment,
} from "./postOperations";
import {
  faHeart,
  faComment,
  faRetweet,
  faShare,
  faEllipsisV,
  faBookmark,
  faTrash,
  faCopy,
  faWarning,
  faPaperPlane,
  faEllipsisVertical,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../axiosInstance";
import Icon from "../../components/Icon/Icon";
import { Link, useParams } from "react-router-dom";
import { useProfile } from "../../hooks/UserContext";
import Alert from "../../components/Alert/Alert";
import Profile from "../Profile/Profile";
import Spinner from "../../components/Spinner/Spinner";
import UserPicture from "../../components/UserPicture/UserPicture";
import Button from "../../components/Button/Button";
import Comment from "./Comment";
import FeedAlerts from "./FeedAlerts";
import PostDropOp from "./PostDropOp";
import SharePost from "./SharePost/SharePost";
import Loader from "../../components/Loader/Loader";
import InstaButton from "../../components/InstaButton/InstaButton";
import useIpProvider from "../../hooks/useIpProvider";
const Feeds = ({ userId, post_id, className }) => {
  const [commentCount, setCommentCount] = useState();
  const [commented, setCommented] = useState({});
  const [posts, setPosts] = useState([]);
  const [dropdownState, setDropdownState] = useState({});
  const [commentState, setCommentState] = useState({});
  const [followState, setFollowState] = useState({});
  const { currentUser } = useProfile();
  const [err, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [liked, setLiked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [postDeleted, setPostDeleted] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState();
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const dropRef = useRef();
  const [showShare, setShowShare] = useState(false);
  const [followBtnState, setFollowBtnState] = useState(false);
  const [followBtnStateText, setFollowBtnStateText] = useState("Follow");
  const ip = useIpProvider();
  //Handle follow function
  const handleFollow = (post_id) => {
    setFollowState((prevState) => ({ [post_id]: !prevState[post_id] }));
    setFollowBtnState((prev) => !prev);
    followBtnState
      ? setFollowBtnStateText("Unfollow")
      : setFollowBtnStateText("Follow");
  };

  function calculateTimeDifference(currentDate, previousDate) {
    const currentDateObj = new Date(currentDate);
    const previousDateObj = new Date(previousDate);

    const difference = currentDateObj.getTime() - previousDateObj.getTime();
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return years === 1 ? "1 year ago" : `${years} years ago`;
    } else if (months > 0) {
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
      return "just now";
    }
  }

  useEffect(() => {
    const re = async () => {
      const res = await handleUpdateComment();
      setCommentCount(res);
    };

    re();
  }, []);

  //handleShowShare

  const handleShowShare = (postId) => {
    setShowShare((prevState) => ({ [postId]: !prevState[postId] }));
  };
  //triel
  // useEffect(()=>{
  //   const test=async ()=>{
  //     try {
  //       const response=await axiosInstance.post("/post/comments",{postId:"658e860975e9f2362589d0d0"});
  //       response.data&&setComments(response.data.reverse())
  //       // setCommented(prev=>!prev)
  //       console.log(response.data)
  //     } catch (error) {
  //       console.log(error.message)
  //     }
  //   }
  //   test()
  // },[commented])
  //To handle copy the text post
  const handleCopyPost = (texttoCopy) => {
    // console.log(texttoCopy)

    if (navigator) {
      //New way
      navigator.clipboard
        .writeText(texttoCopy)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1500);
        })
        .catch((err) => {
          console.log("Error");
        });
    } else {
      //follow legacy way
      const txt_area = document.createElement("input");
      txt_area.value = texttoCopy;
      document.body.appendChild(txt_area);
      txt_area.select();
      document.execCommand("copy");
      document.body.removeChild(txt_area);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  };
  //handle outside click func

  const handleDeletePost = async (postId, currentUserId) => {
    try {
      console.log(postId, currentUserId);
      const response = await axiosInstance.put("/post/delete", {
        postId: postId,
        currentUserId: currentUserId,
      });
      setPostDeleted((prev) => !prev);
      console.log(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    setErrMsg("");
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get("/post");
        if (post_id) {
          setPosts(
            response.data.response.filter((post) => post._id == post_id)
          );
        } else if (userId) {
          setPosts(
            response.data.response.filter((post) => post.postedBy._id == userId)
          );
        } else {
          setPosts(response.data.response.reverse());
        }

        setLoaded((prev) => !prev);

        setLoading(false);
        console.log(response.data.response);
        // console.log(response.data.response);
      } catch (error) {
        setLoading(false);
        setError(true);
        setErrMsg(error.message);
      }
    };
    fetchPosts();

    // setInterval(fetchPosts,5000);
  }, [liked, postDeleted, comments]);

  const handleDropDown = (postId) => {
    setDropdownState((prevState) => ({
      [postId]: !prevState[postId],
    }));
  };
  const checkIslikedByYou = (post) => {
    const isLike = post.likes.includes(currentUser.id);
    return isLike;
  };

  if (id) {
    // return (
    //   <>
    //     <Profile user_Id={id} />
    //   </>
    // );
  } else {
    return (
      <div className={`feed-wrapper ${className}`}>
        {/* Single post */}

        {posts.length != 0 && posts.length != 0 ? (
          posts.map((post) => {
            const isLikedByYou = checkIslikedByYou(post);
            return (
              <div className={`post-wrapper`} key={post._id}>
                <div
                  id={post._id}
                  className={`feed-container  ${className}`}
                  key={post._id}
                >
                  <div className="feed-profile-header">
                    <div className="feed-user-icon">
                      <img
                        className="feed-image"
                        width="50px"
                        src={
                          post.postedBy.userProfile != "/images/userprofile.png"
                            ? `http://${ip}/images/` + post.postedBy.userProfile
                            : post.postedBy.userProfile
                        }
                        alt="user"
                      />
                    </div>
                    <div className="feed-username">
                      {`${post.postedBy.name} `}
                      {
                        <Link
                          id={post.postedBy._id}
                          to={`user/${post.postedBy._id}`}
                          className="user-nickname"
                        >{`@${post.postedBy.username}`}</Link>
                      }
                    </div>

                    <div className="feed-posted-time">
                      {calculateTimeDifference(new Date(), post.createdAt)}
                    </div>
                    <Icon
                      className="vertical-icon"
                      id={post.postedBy.id}
                      icon={faEllipsisV}
                      onClick={() => handleDropDown(post._id)}
                    />
                  </div>
                  <div className="feed-body-content">
                    {post.isImage && (
                      <img
                        className="feed-content-image"
                        src={post.isImage && `http://${ip}/posts/` + post.image}
                      />
                    )}
                    {post.isImage && (
                      <a
                        className="image-download"
                        href={post.isImage && `${ip}/posts/` + post.image}
                        download
                      >
                        <Icon className={"download-icon"} icon={faDownload} />
                      </a>
                    )}
                    <div className="feed-content">{post.content}</div>
                  </div>
                  <div className="feed-fooder">
                    <div className="feed-fooder-icons">
                      <div className="fooder-items">
                        <Icon
                          className={
                            isLikedByYou ? "color-like" : "uncolor-like"
                          }
                          icon={faHeart}
                          onClick={() => {
                            handleLike(post._id, currentUser.id, setLiked);
                          }}
                        />
                        <div>{post.likeCount}</div>
                      </div>
                      <div className="fooder-items">
                        <Icon
                          onClick={() => {
                            handleComment(
                              post._id,
                              setCommentState,
                              setComments
                            );
                          }}
                          icon={faComment}
                        />
                        {<div>{post.commentCount}</div>}
                      </div>

                      <div className="fooder-items">
                        <Icon
                          icon={faShare}
                          onClick={() => {
                            handleShowShare(post._id);
                          }}
                        />
                        <div className="share-text">Share</div>
                      </div>
                    </div>
                    <div className="post-save-btn">
                      <Icon className="light" icon={faBookmark} />
                    </div>
                  </div>
                  {/* Post operations-dropdown */}
                  <PostDropOp
                    currentUser={currentUser}
                    dropdownState={dropdownState}
                    handleCopyPost={handleCopyPost}
                    handleDeletePost={handleDeletePost}
                    post={post}
                    dropRef={dropRef}
                  />

                  {showShare[post._id] && (
                    <SharePost postId={post._id} setShowShare={setShowShare} />
                  )}
                </div>

                {/* Comment section */}
                <Comment
                  calculateTimeDifference={calculateTimeDifference}
                  comment={comment}
                  commentState={commentState}
                  handlePostComment={handlePostComment}
                  post={post}
                  setComment={setComment}
                  comments={comments}
                  currentUser={currentUser}
                />
              </div>
            );
          })
        ) : (
          <h1 className="no-post-info">Oops!No posts.</h1>
        )}
        {/* For alert to user */}
        <FeedAlerts err={err} errMsg={errMsg} isCopied={isCopied} />
      </div>
    );
  }
};

export default Feeds;
