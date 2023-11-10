import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { ThreeCircles } from "react-loader-spinner";
import { useAuth } from "./ContextWrapper";

const SetupModal = ({ isNew, onSelection, saving }) => {
  const {backendActor} = useAuth();
  const [selectedOption, setSelectedOption] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => { 
    const getSuppliers = async () => {
      const response = await backendActor.getAllUsers();
      setSuppliers(response);
    };
    getSuppliers();
  }, []);

  const handleNameChange = (e: any) => {
    setCompanyName(e.target.value);
    if (e.target.value.length < 2) {
      setErrorMessage("Company name must be 2 or more characters long");
    } else if (e.target.value.length > 50) {
      setErrorMessage("Company name must be less than 50 characters long");
    } else {
      setErrorMessage("");
    }

    if (suppliers.some((supplier) => supplier.companyName.toLowerCase() === e.target.value.toLowerCase())) {
      setErrorMessage("Company name already exists");
    }
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-2xl text-gray-600 font-semibold">
                Welcome to Tracy, it looks like this is your first time here.
              </h3>
            </div>
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-xl text-slate-500 leading-relaxed">
                Please select if you are a Supplier or a Fashion House.
              </p>
            </div>
            <div className="flex items-center justify-between px-6 rounded-b">
              <div className="flex flex-col w-full gap-2">
                <button
                  onClick={() => setSelectedOption("supplier")}
                  className={` ${
                    selectedOption === "supplier"
                      ? "bg-gray-700 text-white"
                      : "bg-blue-400 text-white hover:bg-blue-500"
                  } w-full py-2 rounded-lg flex justify-center items-center gap-3`}
                >
                  <span> Supplier</span>
                  {selectedOption === "supplier" && (
                    <span>
                      <AiOutlineCheck size={20} />
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setSelectedOption("fashionHouse")}
                  className={`
                  ${
                    selectedOption === "fashionHouse"
                      ? "bg-gray-700 text-white"
                      : "bg-blue-400 text-white hover:bg-blue-500"
                  }
                  w-full py-2 flex justify-center items-center gap-3 rounded-lg`}
                >
                  <span> Fashion House</span>
                  {selectedOption === "fashionHouse" && (
                    <span>
                      <AiOutlineCheck size={20} />
                    </span>
                  )}
                </button>
                <div className="mb-4">
                <label
                  htmlFor="companyName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  onChange={handleNameChange}
                  className="border border-gray-400 text-gray-700 rounded px-3 py-2 w-full"
                  placeholder="Enter company name"
                />
                {errorMessage !== "" && (
                  <span className="text-red-600">{errorMessage}</span>
                )}
              </div>
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <div className="flex">
                <button
                  className={`
                  ${
                    selectedOption === "" || errorMessage !== "" || companyName.length < 2
                      ? "bg-gray-300 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }
                    text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                  type="button"
                  onClick={
                    selectedOption === "" || errorMessage !== ""
                      ? null
                      : () => onSelection(selectedOption, companyName)
                  }
                >
                  {saving ? (
                    <ThreeCircles
                      height="20"
                      width="20"
                      color="#fff"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                      ariaLabel="three-circles-rotating"
                      outerCircleColor=""
                      innerCircleColor=""
                      middleCircleColor=""
                    />
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default SetupModal;
