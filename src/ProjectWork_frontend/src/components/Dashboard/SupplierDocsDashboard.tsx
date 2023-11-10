import React, { useState } from "react";
import FileModal from "../FileModal";
import DocumentRow from "./DocumentRow";

const SupplierDocsDashboard = ({
  docs,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalDoc, setModalDoc] = useState({});

  const handleModalOpen = (doc: any) => {
    setModalDoc(doc);
    setShowModal(true);
  };

  return (
    <div className="h-screen">
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-y-scroll h-[400px]">
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
                    <th scope="col" className="px-6 py-4">
                      Modify Points
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Points
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Save
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {docs?.map((doc, index) => (
                   <DocumentRow key={index} {...{doc, handleModalOpen, index}}/>
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

export default SupplierDocsDashboard;
