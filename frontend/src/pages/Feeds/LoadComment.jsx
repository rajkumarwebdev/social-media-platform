import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react'
import Icon from '../../components/Icon/Icon';
import useIpProvider from '../../hooks/useIpProvider';

const LoadComment = ({ comments, post, calculateTimeDifference }) => {


  const ip = useIpProvider();

  return (
    <>
      {comments.map((comment) => {
        console.log(comment);

        return (
          comment.postId &&
          post._id && (
            <div key={comment._id}>
              <div className="comment-inner-header">
                <div className="commentedby-profile">
                  <div className="comment-img">
                    {" "}
                    <img
                      className="commented-profile-pic"
                      src={comment.commentedBy.userProfile != "/images/userprofile.png" ? `http://${ip}/images/` + comment.commentedBy.userProfile : comment.commentedBy.userProfile}
                      width="30px"
                      alt=""
                    />
                  </div>
                  <div>{comment.commentedBy.username}</div>
                </div>
                <div className="commented-time">
                  {calculateTimeDifference(new Date(), comment.createdAt)}
                </div>
                <Icon icon={faEllipsisVertical} />
              </div>
              <div>
                <div className="comment-contents">
                  {comment.commentContent}
                </div>
                <div className="comment-reply-btn">Reply</div>
              </div>
            </div>
          )
        );
      })}
    </>
  )
}

export default LoadComment