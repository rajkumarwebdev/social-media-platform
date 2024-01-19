import React, { useEffect } from "react";
import "./singlepost.css";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import Feeds from "../Feeds/Feeds";

const SinglePost = () => {
  useEffect(() => {
    try {
      const getSinglepPost = async () => {
        const response = await axiosInstance.get(`/post/${ids}`);
        console.log(response.data);
      };
      getSinglepPost();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  const { ids } = useParams();
  return <Feeds post_id={ids} />;
};

export default SinglePost;
