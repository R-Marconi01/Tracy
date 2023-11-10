import React, { useEffect, useState } from 'react'
import { ThreeCircles } from 'react-loader-spinner';
import { useAuth } from '../ContextWrapper';
import { Principal } from '@dfinity/principal';
import SupplierDocuments from './SupplierInformation';
import MySupplierRow from './MySupplierRow';

const MySuppliers = () => {
  const {backendActor, identity} = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showSupModal, setShowSupModal] = useState(false);

  useEffect(() => {
    if (identity) {
      getMySuppliers();
    }
  }, [identity]);

  const getMySuppliers = async () => {
    try {
      const response = await backendActor.getFashionHouseSuppliers(
        identity?.getPrincipal()
      );
      setSuppliers(response);
    } catch (error) {
      console.log(error)
    }
  };

  const handleShowDoc = (supplier: any) => {
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
               <MySupplierRow key={index} {...{supplier, index, handleShowDoc, suppliers, setSuppliers}} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center">
            <h1 className="text-2xl text-gray-500">No suppliers to show</h1>
          </div>
        )}
      </div>
      {showSupModal && (
        <SupplierDocuments
          {...{ showSupModal, setShowSupModal, selectedSupplier }}
        />
      )}
    </div>
  )
}

export default MySuppliers