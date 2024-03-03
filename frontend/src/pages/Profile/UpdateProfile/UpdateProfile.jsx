import React, { useState } from 'react'
import "./updateprofile.css";
import axiosInstance from '../../../axiosInstance';
const UpdateProfile = () => {
    const [pic, setPic] = useState();
    const [file, setFile] = useState();
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            const img = URL.createObjectURL(e.target.files[0]);
            setPic(img);

        }
    }
    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);
        console.log(formData);
        try {
            const response = await axiosInstance.post("user/update/profile", formData)
        } catch (err) {
            console.log(err.message)
        }
    }
    return (
        <div className='update-profile-outline'>
            <div><input type="file" accept=".png, .jpg, .jpeg" onChange={(e) => { handleImageUpload(e) }} /></div>
            <img src={pic} alt="preview" style={{ display: pic ? "block" : "none", width: "80px", height: "80px" }}



            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    )
}

export default UpdateProfile