import React, { useEffect, useState } from "react";
import ViewDocs from "./ViewDocs";
import ViewDBRows from "./ViewDBRows";
import { useAuth } from "../ContextWrapper";

const ViewUploadedInfo = () => {
  const [docsTab, setDocsTab] = useState(true);
  const [rowsTab, setRowsTab] = useState(false);

  const { identity, backendActor } = useAuth();

  const [docs, setDocs] = useState([]);
  const [info, setInfo] = useState([]);

  const getDocs = async () => {
    const docs = await backendActor.getSupplierDocs();
    setDocs(docs);
  };

  const getInfo = async () => {
    const res = await backendActor.getSupplierInfo(identity.getPrincipal());
    setInfo(res);
  };

  useEffect(() => {
    if (identity) {
      getDocs();
      getInfo();
    }
  }, [identity]);

  const handleDocsTab = () => {
    setDocsTab(true);
    setRowsTab(false);
  };

  const handleDBRowsTab = () => {
    setDocsTab(false);
    setRowsTab(true);
  };

  return (
    <div className="flex flex-col">
      <div className="flex mt-5 mb-5 gap-2">
        <button
          onClick={handleDocsTab}
          className={`flex items-center gap-2 py-2 px-2 ${
            docsTab
              ? `border-b-2  hover:text-gray-800 border-b-gray-800`
              : `hover:bg-gray-600`
          }   `}
        >
          <span>Uploaded documents</span>
        </button>
        <button
          onClick={handleDBRowsTab}
          className={`flex items-center gap-2 py-2 px-2 ${
            rowsTab
              ? `border-b-2  hover:text-gray-800 border-b-gray-800`
              : `hover:bg-gray-600`
          }   `}
        >
          <span> Company information rows</span>
        </button>
      </div>
      {docsTab && <ViewDocs {...{ docs }} />}
      {rowsTab && <ViewDBRows {...{ info }} />}
    </div>
  );
};

export default ViewUploadedInfo;
