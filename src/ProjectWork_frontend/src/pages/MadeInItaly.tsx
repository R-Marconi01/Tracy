import React, { useEffect, useState } from "react";
import { useAuth } from "../components/ContextWrapper";
import TableRow from "../components/madeinitaly/TableRow";
import SupplierInformation from "../components/FashionHouse/SupplierInformation";
import { ThreeCircles } from "react-loader-spinner";
import { Principal } from "@dfinity/principal";

const MadeInItaly = () => {
  const { backendActor } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showSupModal, setShowSupModal] = useState(false);

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    const response = await backendActor.getAllSuppliers();
    let supplierArray = [];
    for (let supplier of response) {
      const docs = await backendActor.getSuppliersDocuments(Principal.fromText(supplier.principalId));
      let points = 0;
      for (let doc of docs) {
        points += Number(doc.points);
      }
      let supplierObj = {
        ...supplier,
        points,
      };
      supplierArray.push(supplierObj);
      }
    supplierArray.sort((a, b) => b.points - a.points);
    setSuppliers(supplierArray);
    setLoading(false);
  };

  const handleShowInfo = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowSupModal(true);
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-center font-bold text-2xl">Made in Italy Ranking</h1>
      <div className="flex flex-col mt-5 gap-5">
        {loading ? (
          <div className="flex justify-center items-center mt-[100px]">
            <ThreeCircles
              height="50"
              width="50"
              color="#fff"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="three-circles-rotating"
              outerCircleColor=""
              innerCircleColor=""
              middleCircleColor=""
            />
          </div>
        ) : (
          <>
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
                    <th scope="col" className="px-6 py-4">
                      Ranking
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier, index) => (
                    <TableRow
                      key={index}
                      {...{ supplier, index, handleShowInfo }}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center">
                <h1 className="text-2xl text-gray-500">
                  No suppliers at the moment
                </h1>
              </div>
            )}
          </>
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

export default MadeInItaly;
