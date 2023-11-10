import React, { useEffect, useState } from "react";
import { useAuth } from "../components/ContextWrapper";
import { useNavigate } from "react-router-dom";
import Search from "../components/FashionHouse/Search";
import MySuppliers from "../components/FashionHouse/MySuppliers";
import { AiOutlineSearch } from "react-icons/ai";

const FashionHouse = () => {
  const navigate = useNavigate();
  const [openSearch, setOpenSearch] = useState(true);
  const [mySuppliers, setMySuppliers] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (!user.isFashion) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [user]);

  const handleSearchTab = () => {
    setOpenSearch(true);
    setMySuppliers(false);
  };

  const handleViewInfoTab = () => {
    setOpenSearch(false);
    setMySuppliers(true);
  };
  return (
    <div className="min-h-screen">
      <div className="flex mt-5 mb-5 gap-5">
        <button
          onClick={handleSearchTab}
          className={`flex items-center gap-2 py-2 px-2 ${
            openSearch
              ? `border-b-4  hover:text-gray-800 border-b-gray-800`
              : `hover:bg-gray-600`
          }   `}
        >
          <span>Search suppliers</span>
          <AiOutlineSearch size={20} />
        </button>
        <button
          onClick={handleViewInfoTab}
          className={`flex items-center gap-2 py-2 px-2 ${
            mySuppliers
              ? `border-b-4  hover:text-gray-800 border-b-gray-800`
              : `hover:bg-gray-600`
          }   `}
        >
          <span> View my Suppliers</span>
        </button>
      </div>
      <div className=" p-5 rounded-lg ">
        {openSearch && <Search />}
        {mySuppliers && <MySuppliers />}
      </div>
    </div>
  );
};

export default FashionHouse;
