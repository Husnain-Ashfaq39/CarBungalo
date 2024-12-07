'use client'
import { useEffect, useState } from "react";
import ProfilePicUploader from "./ProfilePicUploader";
import useUserStore from "@/utils/store/userStore";
import useFetchUserData from "@/utils/Hooks/useFetchUserData";
import dbServices from "@/utils/appwrite/Services/dbServices";
import TextField from '@mui/material/TextField';
import { toast, ToastContainer } from "react-toastify";

const AccountDetails = () => {
  const { user } = useUserStore();
  const userId = user?.userId || null;
  const { userData, error } = useFetchUserData(userId);
  
  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dbServices.Users.update(userId, formData);
      toast.success("User data updated successfully!");
    } catch (err) {
      console.error("Error updating user data:", err);
      toast.error("Failed to update user data.");
    }
  };

  return (
    <>
      <form className="contact_form" onSubmit={handleSubmit}>
        <div className="dp_user_thumb_content">
          <ProfilePicUploader />
        </div>
        {/* End profile image uploader */}

        {error && <p className="error">{error}</p>}

        <div className="row">
          <div className="col-lg-7">
            <div className="row">
              {["name", "location", "telephone", "email"].map((field, index) => (
                <div className="col-sm-6" key={index}>
                  <div className="mb20">
                    <TextField
                      error={field === "email" && !formData[field]}
                      id={field}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={field !== "email" ? handleInputChange : null}
                      required={field === "name"}
                      disabled={field === "email"}
                      fullWidth
                    />
                  </div>
                </div>
              ))}
              <div className="col-lg-12">
                <div className="new_propertyform_btn">
                  <button type="submit" className="btn btn-thm ad_flor_btn">
                    Save
                  </button>
                </div>
              </div>
              {/* End .col */}
            </div>
          </div>
        </div>
      </form>
      <ToastContainer closeButton={false} limit={1} />
    </>
  );
};

export default AccountDetails;
