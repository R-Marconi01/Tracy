import React, { useEffect, useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { AiOutlineFolderView } from "react-icons/ai";
import ViewUploadedInfo from "../components/Supplier/ViewUploadedInfo";
import UploadInfo from "../components/Supplier/UploadInfo";
import { useAuth } from "../components/ContextWrapper";
import { useNavigate } from "react-router-dom";

const SupplierPortal = () => {
  const [upload, setUpload] = useState(true);
  const [viewInfo, setViewInfo] = useState(false);

  const navigate = useNavigate();

  const { user } = useAuth();

  const handleUploadTab = () => {
    setUpload(true);
    setViewInfo(false);
  };

  const handleViewInfoTab = () => {
    setUpload(false);
    setViewInfo(true);
  };

  useEffect(() => {
    if (user) {
      if (!user.isSupplier) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="">
      <div className="flex mt-5 mb-5 gap-5">
        <button
          onClick={handleUploadTab}
          className={`flex items-center gap-2 py-2 px-2 ${
            upload
              ? `border-b-4  hover:text-gray-800 border-b-gray-800`
              : `hover:bg-gray-600`
          }   `}
        >
          <span>Upload Information</span>
          <AiOutlineUpload size={20} />
        </button>
        <button
          onClick={handleViewInfoTab}
          className={`flex items-center gap-2 py-2 px-2 ${
            viewInfo
              ? `border-b-4  hover:text-gray-800 border-b-gray-800`
              : `hover:bg-gray-600`
          }   `}
        >
          <span> View uploaded information</span>
          <AiOutlineFolderView size={20} />
        </button>
      </div>
      <div className=" p-5 rounded-lg shadow-md">
        {upload && <UploadInfo />}
        {viewInfo && <ViewUploadedInfo />}
      </div>
    </div>
  );
};

export default SupplierPortal;
