import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import APIRoutes from '../utils/APIRoutes';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../utils/toast';
import ChiefWardenLeftSideBar from '../components/ChiefWardenLeftSidebar';
import RightSideBar from '../components/RightSideBar';
import ProfileImageModal from '../components/ProfileImageModal';

const ChiefWardenDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hostelCode, setHostelCode] = useState('');
  const [hostelName, setHostelName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(APIRoutes.authCheck, { withCredentials: true });
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
          // console.log(response.data.user.profilePicture);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.log(error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    try {
      const fetchHostelData = async () => {
        const response = await axios.get(APIRoutes.getHostelNameAndCode, { withCredentials: true });
        if (response.data.success) {
          setHostelName(response.data.hostelName);
          setHostelCode(response.data.hostelCode);
        }
      };

      fetchHostelData();
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const uploadFile = async (type,timestamp,signature) => {
    const data = new FormData();
    data.append("file", image);
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

  const handleUpload = async () => {
    try {
      const { timestamp: imgTimestamp, signature: imgSignature } = await getSignatureForUpload();
      const fileUrl = await uploadFile('image', imgTimestamp, imgSignature);
      // console.log(imgUrl);
      const response = await axios.post(APIRoutes.uploadProfileImage, { profilePicture: fileUrl }, { withCredentials: true });
      if (response.data.success) {
        showToast(response.data.message, "success");
        setUser({ ...user, profilePicture: fileUrl });
      } else {
        showToast(response.data.message, "error");
      }
      setImage(null);
    } catch (error) {
      showToast(error.data.message, "error");
      console.error('Error updating notice', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
      <>
        <ProfileImageModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          handleImageChange={handleImageChange}
          handleUpload={handleUpload}
          setImage={setImage}
          image={image}
        />
        <div className="flex h-screen bg-gradient-to-br from-pink-100 to-orange-100">
          {/* Left Sidebar */}
          <ChiefWardenLeftSideBar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md mt-4 text-center w-full max-w-lg mx-auto">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-300"
                onClick={() => setModalOpen(true)}
              />
              <h2 className="text-2xl font-semibold">{user.username}</h2>
              <p className="text-gray-600 text-lg">Hostel Name: {hostelName}</p>
              <p className="text-gray-600 text-lg">Hostel Code: {hostelCode}</p>
            </div>
          </main>

          {/* Right Sidebar */}
          <RightSideBar />
        </div>
      </>
  );
};

export default ChiefWardenDashboard;
