import React, { useState } from 'react'
import { ThreeCircles } from 'react-loader-spinner'
import { useAuth } from '../ContextWrapper';
import { Principal } from '@dfinity/principal';

const SearchTable = ({supplier, index, handleShowInfo, searchResults, setSearchResults}) => {
    const {backendActor} = useAuth()
    const [saving, setSaving] = useState(false);

    const handleAdd = async (supplier: any) => {
        try {
          setSaving(true);
          await backendActor.addToFashionHouseSuppliers(
            Principal.fromText(supplier.principalId)
          );
          const updatedSuppliers = searchResults.map((s) => {
            if (s.principalId === supplier.principalId) {
              return { ...s, isInList: true };
            }
            return s;
          });
          setSearchResults(updatedSuppliers);
          setSaving(false);
        } catch (error) {
          console.log(error);
        }
      };
    
      const handleRemove = async (supplier: any) => {
        try {
          setSaving(true);
          await backendActor.removeFromFashionHouseSuppliers(
            Principal.fromText(supplier.principalId)
          );
          const updatedSuppliers = searchResults.map((s) => {
            if (s.principalId === supplier.principalId) {
              return { ...s, isInList: false };
            }
            return s;
          });
          setSearchResults(updatedSuppliers);
          setSaving(false);
        } catch (error) {
          console.log(error);
        }
      };

  return (
    <tr key={index} className="border-b dark:border-neutral-500">
    <td className="whitespace-nowrap px-6 py-4 font-medium">
      {index + 1}
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      {supplier.companyName}
    </td>
    <td className="whitespace-nowrap px-6 py-4 flex items-center gap-3">
      {supplier.isInList ? (
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
      ) : (
        <button
          onClick={() => handleAdd(supplier)}
          className="px-2 py-1.5 rounded-md bg-blue-500 text-white"
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
            <span>Add Supplier</span>
          )}
        </button>
      )}
      <button
        onClick={() => handleShowInfo(supplier)}
        className="px-2 py-1.5 rounded-md bg-blue-500 text-white"
      >
        View information
      </button>
    </td>
  </tr>
  )
}

export default SearchTable