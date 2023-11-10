import React, { useState } from "react";
import SupplierInformation from "../FashionHouse/SupplierInformation";
import SupplierInfoDashboard from "./SupplierInfoDashboard";

const Suppliers = ({ suppliers }) => {
  const [showSupModal, setShowSupModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const handleShowInfo = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowSupModal(true);
  };

  return (
    <div>
      <div className="flex flex-col mt-5 gap-5">
        {suppliers.length > 0 ? (
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
              {suppliers.map((supplier, index) => (
                <tr key={index} className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap px-6 py-4 font-medium">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {supplier.companyName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 flex items-center gap-3">
                    <button
                      onClick={() => handleShowInfo(supplier)}
                      className="px-2 py-1.5 rounded-md bg-blue-500 text-white"
                    >
                      View information
                    </button>
                  </td>
                </tr>
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
        <SupplierInfoDashboard
          {...{ showSupModal, setShowSupModal, selectedSupplier, setSelectedSupplier }}
        />
      )}
    </div>
  );
};

export default Suppliers;
