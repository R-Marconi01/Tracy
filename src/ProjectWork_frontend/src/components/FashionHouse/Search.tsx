import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useAuth } from "../ContextWrapper";
import SupplierInformation from "./SupplierInformation";
import { ThreeCircles } from "react-loader-spinner";
import { Principal } from "@dfinity/principal";
import SearchTable from "./SearchTable";

const Search = () => {
  const { backendActor, identity } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mySuppliers, setMySuppliers] = useState(null);
  const [suppliersData, setSuppliersData] = useState(null);

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [showSupModal, setShowSupModal] = useState(false);

  useEffect(() => {
   if (identity) {
      getMySuppliers();
      getSuppliers();
    }
  }, [identity]);

  const getMySuppliers = async () => {
    const response = await backendActor.getFashionHouseSuppliers(
      identity?.getPrincipal()
    );
    setMySuppliers(response);
  };

  const getSuppliers = async () => {
    const response = await backendActor.getAllSuppliers();
    setSuppliersData(response);
  };

  const modifySuppliers = () => {
    const modifiedSuppliers = suppliersData.map((supplier) => {
      const isInList = mySuppliers.some(
        (mySupplier) => mySupplier.principalId === supplier.principalId
      );
      return { ...supplier, isInList };
    });
    setSuppliers(modifiedSuppliers);
  };

  useEffect(() => {
    if (mySuppliers && suppliersData) {
      modifySuppliers();
    }
  }, [mySuppliers, suppliersData]);



  useEffect(() => {
    search(searchQuery);
  }, [searchQuery]);

  const search = (searchQuery) => {
    const filteredSuppliers = suppliers.filter((supplier) => {
      let supplierName = supplier.companyName.toLowerCase();
      return supplierName.includes(searchQuery.toLowerCase());
    });
    setSearchResults(filteredSuppliers);
  };

  const handleShowInfo = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowSupModal(true);
  };
  return (
    <div>
      <div className="flex justify-center">
        <form className="flex mt-5 border-b-2 w-3/4 items-center p-2 rounded-3xl text-xl gap-10 bg-white ">
          <AiOutlineSearch className="text-gray-500 text-3xl" />
          <input
            type="text"
            className="w-3/4  outline-none text-gray-700 "
            placeholder="Search for suppliers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      <div className="flex flex-col mt-5 gap-5">
        {searchResults.length > 0 ? (
          <table className="min-w-full text-left text-sm ">
            <thead className="border-b font-medium dark:border-neutral-500">
              <tr>
                <th scope="col" className="px-6 py-4">
                  #
                </th>
                <th scope="col" className="px-6 py-4">
                  Company Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((supplier, index) => (
               <SearchTable key={index} {...{supplier, index, handleShowInfo, searchResults, setSearchResults}}/>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center">
            <h1 className="text-2xl text-gray-500">No results to show</h1>
          </div>
        )}
      </div>
      {showSupModal && (
        <SupplierInformation
          {...{ showSupModal, setShowSupModal, selectedSupplier }}
        />
      )}
    </div>
  );
};

export default Search;
