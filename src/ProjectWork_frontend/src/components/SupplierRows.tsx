import React from "react";
import { Link } from "react-router-dom";

const SupplierRows = ({ info }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
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
                    City Destination
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Supplier
                  </th>
                  <th scope="col" className="px-6 py-4">
                    City of Origin
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Product Type
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {info.map((row, index) => (
                  <tr key={index} className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {row.companyName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {row.cityDestination}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        className="cursor-pointer font-semibold rounded px-2 py-1.5 bg-blue-500"
                        to={`../supplier/${row.supplier}`}
                      >
                        {row.supplier}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {row.cityOrigin}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {row.productType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {Number(row.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierRows;
