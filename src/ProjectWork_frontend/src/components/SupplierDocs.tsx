import React, { useState } from "react";
import FileModal from "./FileModal";

const SupplierDocs = ({ docs }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalDoc, setModalDoc] = useState({});

  const handleModalOpen = (doc: any) => {
    setModalDoc(doc);
    setShowModal(true);
  };
  return (
    <div className="min-h-screen">
      <div className="flex flex-col">
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
                      Filename
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {docs?.map((doc, index) => (
                    <tr
                      key={index}
                      className="border-b dark:border-neutral-500"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {doc.filename}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 flex items-center gap-3">
                        <button
                          onClick={() => handleModalOpen(doc)}
                          className="px-2 py-1.5 rounded-md bg-blue-500 text-white"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showModal && <FileModal {...{ showModal, setShowModal, modalDoc }} />}
    </div>
  );
};

export default SupplierDocs;
