import React, { useEffect, useState } from "react";
import { useAuth } from "../components/ContextWrapper";
import { toast } from "react-toastify";
import { Principal } from "@dfinity/principal";
import SupplierInformation from "../components/FashionHouse/SupplierInformation";

const Consumer = () => {
  const { backendActor } = useAuth();
  const [error, setError] = useState("");
  const [fhNotFound, setFhNotFound] = useState(false);
  const [houses, setHouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [product1, setProduct1] = useState("");
  const [product2, setProduct2] = useState("");
  const [product3, setProduct3] = useState("");

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showSupModal, setShowSupModal] = useState(false);

  const handleCompanyNameChange = async (e: any) => {
    setCompanyName(e.target.value);
    setFhNotFound(false);
  };

  const handleSearch = async () => {
    setSuppliers([]);
    try {
      if (
        companyName !== "" &&
        product1 === "" &&
        product2 === "" &&
        product3 === ""
      ) {
        const matchingHouse = houses.find(
          (house) =>
            house.companyName.toLowerCase() === companyName.toLowerCase()
        );
        // If no supplier is found then we set the not found error and return
        if (!matchingHouse) {
          setFhNotFound(true);
          return;
        }

        // Here we get all the suppliers that are associated with the select fashion house
        let fhSuppliers = await backendActor.getFashionHouseSuppliers(
          Principal.fromText(matchingHouse.principalId)
        );
        for (let supplier of fhSuppliers) {
          let modifiedSupplier = {
            ...supplier,
            type: "Primary Supplier",
          };
          setSuppliers((prev) => [...prev, modifiedSupplier]);
        }
      } else if (
        companyName === "" ||
        (product1 === "" && product2 === "" && product3 === "")
      ) {
        setError("Please enter Fashion House and atleast one product type");
        return;
      } else {
        // Here we find the supplier who matches the fashion house name given by the user
        const matchingHouse = houses.find(
          (house) =>
            house.companyName.toLowerCase() === companyName.toLowerCase()
        );
        // If no supplier is found then we set the not found error and return
        if (!matchingHouse) {
          setFhNotFound(true);
          return;
        }

        // Here we get all the suppliers that are associated with the select fashion house
        let fhSuppliers = await backendActor.getFashionHouseSuppliers(
          Principal.fromText(matchingHouse.principalId)
        );

        // We initialize an array to store the db rows for the suppliers who are ascociated with the fashion house
        let suppliersDBRows = [];

        // Here are looping through the suppliers and getting db rows for each of the suppliers and push them to the array above
        for (const supplier of fhSuppliers) {
          const supplierDetails = await backendActor.getSupplierInfo(
            Principal.fromText(supplier.principalId)
          );
          suppliersDBRows.push(supplierDetails);
        }

        console.log("Suppliers db rows", suppliersDBRows);

        // Here initialize an array to store the suppliers that are in the db rows orders of the suppliers associated with the fashion house
        let tempSuppliers = [];

        // Here we loop through the db rows and check if there is a order with a
        // product that matches the product types given by the user,
        // if there is, we then fetch the supplier for that product and add them to the temp array and the final search array
        for (const innerArray of suppliersDBRows) {
          for (const row of innerArray) {
            const productTypeLowerCase = row.productType.toLowerCase();
            if (
              productTypeLowerCase === product1.toLowerCase() ||
              productTypeLowerCase === product2.toLowerCase() ||
              productTypeLowerCase === product3.toLowerCase()
            ) {
              const productSupplier = await backendActor.getSupplierByName(
                row.supplier
              );
              if (productSupplier.length > 0) {
                const modifiedSupplier = {
                  ...productSupplier[0],
                  type: row.productType.toLowerCase(),
                };
                let supplierInTempSuppliers = tempSuppliers.find(
                  (supplier) =>
                    supplier.principalId === modifiedSupplier.principalId
                );
                if (!supplierInTempSuppliers) {
                  setSuppliers((prev) => [...prev, modifiedSupplier]);
                  tempSuppliers.push(modifiedSupplier);
                }
              
              }
            }
          }
        }

        // Here we loop through the suppliers associated with the fashion house and check if they are not in the db rows suppliers, we then mark them as primary suppliers
        for (const supplier of fhSuppliers) {
          const notInRows = tempSuppliers.find(
            (sup) => sup.principalId === supplier.principalId
          );
          if (!notInRows) {
            let modifiedSupplier = {
              ...supplier,
              type: "Primary Supplier",
            };
            // Now we check if the primary supplier have a db row that with an order that have product type that matches the product types given by the user
            const supplierRows = await backendActor.getSupplierInfo(
              Principal.fromText(modifiedSupplier.principalId)
            );
            let dizSuppliers = [];
            for (const row of supplierRows) {
              const productTypeLowerCase = row.productType.toLowerCase();
              if (
                productTypeLowerCase === product1.toLowerCase() ||
                productTypeLowerCase === product2.toLowerCase() ||
                productTypeLowerCase === product3.toLowerCase()
              ) {
                let supplierInDizSuppliers = dizSuppliers.find(
                  (supplier) =>
                    supplier.principalId === modifiedSupplier.principalId
                );
                if (!supplierInDizSuppliers) {
                  setSuppliers((prev) => [...prev, modifiedSupplier]);
                  dizSuppliers.push(modifiedSupplier);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (error !== "") {
      toast.error(`${error}`, {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      setError("");
    }
  }, [error]);

  useEffect(() => {
    getHouses();
  }, []);

  const getHouses = async () => {
    try {
      const res = await backendActor.getAllFashionHouses();
      setHouses(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowInfor = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowSupModal(true);
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="bg-gray-600 p-5 rounded-lg mx-[100px] md:mx-[200px] flex flex-col items-center ">
          {fhNotFound && (
            <h1 className="text-red-500 text-lg mb-4">
              No Fashion House found with this name
            </h1>
          )}
          <h1 className="text-2xl font-semibold mb-1">Supplier Search </h1>
          <h1 className="text-xs mb-4">
            (You can search upto 3 products at once)
          </h1>
          <div className="mb-4">
            <label className="block mb-2 text-gray-200">Fashion House:</label>
            <input
              type="text"
              value={companyName}
              onChange={handleCompanyNameChange}
              className="w-full border border-gray-300 text-gray-700 rounded-md px-4 py-2"
              placeholder="Enter Fashion House Name"
            />
          </div>
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
              <label className="block mb-2 text-gray-200">
                Product Type 1:
              </label>
              <input
                type="text"
                value={product1}
                onChange={(e) => setProduct1(e.target.value)}
                className="w-full border border-gray-300 text-gray-700 rounded-md px-4 py-2"
                placeholder="Enter Product Type"
              />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
              <label className="block mb-2 text-gray-200">
                Product Type 2:
              </label>
              <input
                type="text"
                value={product2}
                onChange={(e) => setProduct2(e.target.value)}
                className="w-full border border-gray-300 text-gray-700 rounded-md px-4 py-2"
                placeholder="Enter Product Type"
              />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
              <label className="block mb-2 text-gray-200">
                Product Type 3:
              </label>
              <input
                type="text"
                value={product3}
                onChange={(e) => setProduct3(e.target.value)}
                className="w-full border border-gray-300 text-gray-700 rounded-md px-4 py-2"
                placeholder="Enter Product Type"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:shadow-lg transition duration-300"
          >
            Search
          </button>
        </div>
        <div className="flex flex-col mt-5 gap-5">
          {suppliers.length > 0 ? (
            <div className="">
              <h1 className="text-center my-3 font-semibold ">{`These are suppliers associated with ${companyName} that supply ${
                product1 !== "" ? `${product1}` : ``
              }
            ${product2 !== "" ? `, ${product2}` : ``}
            `}</h1>
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
                      Product Type
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier, index) => (
                    <tr
                      key={index}
                      className="border-b dark:border-neutral-500"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {supplier.companyName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {supplier.type}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 flex items-center gap-3">
                        <button
                          onClick={() => handleShowInfor(supplier)}
                          className="px-2 py-1.5 rounded-md bg-blue-500 text-white"
                        >
                          View information
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center">
              <h1 className="text-2xl text-gray-500">No results to show</h1>
            </div>
          )}
        </div>
      </div>
      {showSupModal && (
        <SupplierInformation
          {...{ showSupModal, setShowSupModal, selectedSupplier }}
        />
      )}
    </>
  );
};

export default Consumer;
