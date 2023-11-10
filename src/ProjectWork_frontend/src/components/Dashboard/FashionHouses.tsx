import React from "react";

const FashionHouses = ({ houses }) => {
  return (
    <div>
      <div className="flex flex-col mt-5 gap-5">
        {houses.length > 0 ? (
          <table className="min-w-full text-left text-sm ">
            <thead className="border-b font-medium dark:border-neutral-500">
              <tr>
                <th scope="col" className="px-6 py-4">
                  #
                </th>
                <th scope="col" className="px-6 py-4">
                  Company Name
                </th>
              </tr>
            </thead>
            <tbody>
              {houses.map((houese, index) => (
                <tr key={index} className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap px-6 py-4 font-medium">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {houese.companyName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center">
            <h1 className="text-2xl text-gray-500">
              No fashion houses to show yet
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default FashionHouses;
