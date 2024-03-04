import React, { useEffect, useState } from 'react'
import "./updateprofile.css";
import axiosInstance from '../../../axiosInstance';
import Icon from "../../../components/Icon/Icon";
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useProfile } from '../../../hooks/UserContext';
import { Link } from 'react-router-dom';
import useIpProvider from '../../../hooks/useIpProvider';
const UpdateProfile = () => {
    const [pic, setPic] = useState();
    const [file, setFile] = useState();
    const { currentUser } = useProfile();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [gender, setGender] = useState("");
    const [errors, setErrors] = useState({});
    const ip = useIpProvider();
    useEffect(() => {

        const getDetails = async () => {
            try {
                const id = JSON.parse(localStorage.getItem("_user")).id
                const response = await axiosInstance.post("user/profile", { id: id })

                if (response) {
                    setName(response.data.response.name)
                    setUsername(response.data.response.username)
                    setGender(response.data.response.gender)
                }
            } catch (err) {
                console.log(err.message);
            }
        }
        getDetails()


    }, [])
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            const img = URL.createObjectURL(e.target.files[0]);
            setPic(img);

        }
    }
    const handleValidate = () => {
        const errs = {}
        if (name.trim() == "") {
            errs.name = "Enter user"
        }
        if (username.trim() == "") {
            errs.username = "Enter username"
        }
        if (gender.trim() == "") {
            errs.gender = "Enter your gender"
        }
        if (Object.keys(errs).length == 0) {
            setErrors({})
            return true
        }
        else {
            setErrors(errs);
            return false
        }
    }
    const handleUpload = async () => {
        if (handleValidate()) {
            const id = JSON.parse(localStorage.getItem("_user")).id
            console.log("true")
            const formData = new FormData();
            formData.append("file", file);
            formData.append("ids", id);
            try {
                const result = await axiosInstance.post("user/update/profiles", { id: id, name: name, username: username, gender: gender })

                const response = await axiosInstance.post("user/update/profile", file && formData, { headers: { "Content-Type": "multipart/form-data" } })

                location.replace("/profile")

            } catch (err) {
                console.log(err.message)
            }
        }
    }

    return (
        <div className='update-profile-outline'>
            <div className='update-profile-container'>
                <div className='update-header-section'>
                    <div className='update-user-image-holder'>
                        <img className='update-user-image' src={pic ? pic : currentUser.profilePic != "/images/userprofile.png" ? `http://${ip}/images/` + currentUser.profilePic : currentUser.profilePic} alt="preview" />
                        <input className='upload-image-button' type="file" accept=".png, .jpg, .jpeg" onChange={(e) => { handleImageUpload(e) }} />
                        <Icon className="edit-profile-icon" icon={faEdit} />
                    </div>
                </div>

                <div className='update-fields'>
                    <div className='update-field'>
                        <label>Name</label>
                        <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
                    </div>
                    {errors.name && <div>{errors.name}</div>}
                    <div className='update-field'>
                        <label>Username</label>
                        <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
                    </div>
                    {errors.username && <div>{errors.username}</div>}
                    <div className='update-field gender-update'>
                        <label>Gender</label>
                        <select onChange={(e) => setGender(e.target.value)} >
                            <option selected={currentUser.gender == "male"} value="male">Male</option>
                            <option selected={currentUser.gender == "female"} value="female">Female</option>
                        </select>
                    </div>
                    {errors.gender && <div>{errors.gender}</div>}
                </div>
                <div className='update-button-holder'><button onClick={handleUpload} className='profile-update-btn'>Update</button></div>
                <Link className='profile-update-back-link' to={"/settings/accounts"} ><Icon className={"profile-update-back-arrow"} icon={faArrowLeft} ></Icon></Link>
            </div>
        </div>
    )
}

export default UpdateProfile