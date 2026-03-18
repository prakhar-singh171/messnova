import React, { useEffect, useState } from 'react'
import StudentLeftSideBar from '../components/StudentLeftSideBar'
import RightSideBar from '../components/RightSideBar.jsx'
import axios from 'axios'
import APIRoutes from '../utils/APIRoutes.js'
import { showToast } from '../utils/toast.js'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

function RaiseComplaint() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [values, setValues] = useState({
        title: "",
        description: "",
        file: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(APIRoutes.authCheck, { withCredentials: true });
                // console.log(data);
                if (data.isAuthenticated && (data.user.role === 'student')) {
                    // console.log(data.user);
                    setUser(data.user);
                }
                else {
                    navigate("/login");
                }
            } catch (error) {
                console.log(error);
                navigate('/login');
            }
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === "file") {
            // For file inputs, use files[0] as value
            setValues({ ...values, [name]: files[0] });
        } else {
            setValues({ ...values, [name]: value });
        }
    }

    const uploadFile = async (type,timestamp,signature) => {
        const data = new FormData();
        data.append("file", values.file);
        data.append("timestamp",timestamp);
        data.append("signature",signature);
        data.append("api_key",import.meta.env.VITE_CLOUDINARY_API_KEY);
    
        try{
          const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
          const resourceType = type;
          const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
          const res = await axios.post(api,data);
          const { secure_url } = res.data;
          return secure_url;
        }catch(error){
          console.log(error);
        }
      }

    const getSignatureForUpload = async () => {
        try{
          const res = await axios.get(APIRoutes.getSignature,{ withCredentials: true });
          return res.data;
        }catch(error){
          console.log(error);
        }
      }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!values.title){
                showToast("Title fields is mandetory", "error");
                return;
            }
            const { timestamp:imgTimestamp, signature : imgSignature} = await getSignatureForUpload();
            const fileUrl = await uploadFile('image',imgTimestamp,imgSignature);
            // console.log(imgUrl);
            const { title, description } = values;
            const { data } = await axios.post(APIRoutes.raiseComplaint, { title, description, file: fileUrl }, { withCredentials: true });
            // console.log(data);
            if (data.success) {
                showToast(data.message, "success");
            }
            setValues({
                title: "",
                description: "",
                file: null,
              });
            document.getElementById("fileInput").value = ""; 
        } catch (error) {
            showToast(error.data.message, "error");
            console.error('Error updating notice', error);
        }
      };

    if(!user){
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-pink-100 to-orange-100">
            {/* Left Sidebar */}
            <StudentLeftSideBar />

            {/* Main Content */}
            <main className="flex-1 flex justify-center items-center text-xl font-semibold text-gray-700">
                <div className="w-3/4 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
                        <h2 className="text-2xl font-bold mb-4 text-center">Raise Complaint</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Title"
                                name="title"
                                value={values.title}
                                onChange={handleChange}
                                className="w-full p-3 border rounded mb-3"
                            />
                            <textarea
                                placeholder="Description"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                className="w-full p-3 border rounded mb-3 h-28 resize-none"
                            ></textarea>
                            <input
                                type="file"
                                name="file"
                                id="fileInput"
                                onChange={handleChange}
                                className="w-full p-2 border rounded mb-3"
                            />
                            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded">Post Complaint</button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Right Sidebar */}
            <ToastContainer />
            <RightSideBar />
        </div>
    )
}

export default RaiseComplaint
