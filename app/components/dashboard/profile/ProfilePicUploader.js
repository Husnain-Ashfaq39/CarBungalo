'use client';

import React, { useState, useEffect } from "react";
import storageServices from "@/utils/appwrite/Services/storageServices";
import dbServices from "@/utils/appwrite/Services/dbServices";
import useUserStore from "@/utils/store/userStore";
import { Camera } from 'lucide-react';

const ProfilePicUploader = () => {
  const { user } = useUserStore();
  const userId = user?.userId || null;

  const defaultImage = "/images/defaultprofile.jpg";
  const [selectedImage, setSelectedImage] = useState(defaultImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return; // Early exit if no userId is available

    const fetchUserProfilePic = async () => {
      try {
        const userDoc = await dbServices.Users.get(userId);
        if (userDoc?.profileId) {
          const imageUrl = await storageServices.images.getFileDownload(userDoc.profileId);
          setSelectedImage(imageUrl);
        }
      } catch (err) {
        console.error("Error fetching user profile picture:", err);
      }
    };

    fetchUserProfilePic();
  }, [userId]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      setSelectedImage(defaultImage);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fileId = await uploadProfilePic(file);
      await updateUserProfile(fileId.$id);
      setSelectedImage(URL.createObjectURL(file));
    } catch (err) {
      console.error("Error uploading file or updating user profile:", err);
      setError("An error occurred while uploading the profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const uploadProfilePic = async (file) => {
    try {
      return await storageServices.images.createFile(file);
    } catch (err) {
      throw new Error("Error uploading file.");
    }
  };

  const updateUserProfile = async (fileId) => {
    if (!userId) {
      throw new Error("User ID is required to update the profile.");
    }

    try {
      const userDoc = await dbServices.Users.get(userId);
      if (!userDoc) throw new Error("User document not found.");

      await dbServices.Users.update(userDoc.$id, {
        profileId: fileId,
      });
    } catch (err) {
      throw new Error("Error updating user profile.");
    }
  };

  return (
    <div className="wrap-custom-file mb25 relative">
      <input
        type="file"
        name="image1"
        id="image1"
        accept=".gif, .jpg, .jpeg, .png"
        onChange={handleImageChange}
        className="hidden"
      />
      <label
        htmlFor="image1"
        className="cursor-pointer block w-32 h-32 rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:opacity-80"
        style={{
          backgroundImage: `url("${selectedImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
      </label>
      <div 
        className="absolute bottom-2 left-24 z-10 bg-secondary rounded-full p-1 cursor-pointer"
        onClick={() => document.getElementById('image1').click()}
      >
        <Camera className="text-black" size={16} />
      </div>
      {loading && <p className="mt-2 text-sm text-gray-600">Uploading...</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      
    </div>
  );
};

export default ProfilePicUploader;

