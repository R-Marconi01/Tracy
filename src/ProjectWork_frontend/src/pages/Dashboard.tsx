import React, { useEffect, useState } from "react";
import { useAuth } from "../components/ContextWrapper";
import { useNavigate } from "react-router-dom";
import Suppliers from "../components/Dashboard/Suppliers";
import FashionHouses from "../components/Dashboard/FashionHouses";

const Dashboard = () => {
  const { backendActor, identity, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [viewSuppliers, setViewSuppliers] = useState(true);
  const [viewFhouses, setViewFhouses] = useState(false);

  useEffect(() => {
    (async () => {
      const hss = await backendActor. getAllFashionHouses();
      setHouses(hss);
      const sps = await backendActor.getAllSuppliers();
      setSuppliers(sps);
    })();
  }, []);

  const handleSuppliersTab = () => {
    setViewSuppliers(true);
    setViewFhouses(false);
  };

  const handleFhousesTab = () => {
    setViewSuppliers(false);
    setViewFhouses(true);
  };

  useEffect(() => {
    if (identity) {
      if (!isAdmin) {
        navigate("/");
      }
    }
  }, [identity]);
  return (
    <div className="min-h-screen">
      <h1 className=" text-center font-bold text-2xl">
        Dashboard- Manage Tracy
      </h1>
      <div className="flex mt-5 mb-5 gap-5">
        <button
          onClick={handleSuppliersTab}
          className={`flex items-center gap-2 py-2 px-2 ${
            viewSuppliers
              ? `border-b-4  hover:text-gray-800 border-b-gray-800`
              : `hover:bg-gray-600`
          }   `}
        >
          <span>Suppliers</span>
        </button>
        <button
          onClick={handleFhousesTab}
          className={`flex items-center gap-2 py-2 px-2 ${
            viewFhouses
              ? `border-b-4  hover:text-gray-800 border-b-gray-800`
              : `hover:bg-gray-600`
          }   `}
        >
          <span>Fashion houses</span>
        </button>
      </div>
      <div className=" p-5 rounded-lg ">
        {viewSuppliers && <Suppliers {...{suppliers}} />}
        {viewFhouses && <FashionHouses {...{houses}} />}
      </div>
    </div>
  );
};

export default Dashboard;
