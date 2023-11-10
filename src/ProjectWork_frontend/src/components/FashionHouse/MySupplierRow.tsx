import React, { useState } from "react";
import { ThreeCircles } from "react-loader-spinner";
import { useAuth } from "../ContextWrapper";
import { Principal } from "@dfinity/principal";

const MySupplierRow = ({
  supplier,
  index,
  handleShowDoc,
  suppliers,
  setSuppliers,
}) => {
  const { backendActor } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleRemove = async (supplier: any) => {
    try {
      setSaving(true);
      await backendActor.removeFromFashionHouseSuppliers(
        Principal.fromText(supplier.principalId)
      );
      const updatedSuppliers = suppliers.filter(
        (item) => item.principalId !== supplier.principalId
      );
      setSuppliers(updatedSuppliers);
      setSaving(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <tr key={index} className="border-b dark:border-neutral-500">
      <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
      <td className="whitespace-nowrap px-6 py-4">{supplier.companyName}</td>
      <td className="whitespace-nowrap px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => handleRemove(supplier)}
          className="px-2 py-1.5 rounded-md bg-red-500 text-white"
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
            <span>Remove Supplier</span>
          )}
        </button>

        <button
          onClick={() => handleShowDoc(supplier)}
          className="px-2 py-1.5 rounded-md bg-blue-500 text-white"
        >
          View documents
        </button>
      </td>
    </tr>
  );
};

export default MySupplierRow;
