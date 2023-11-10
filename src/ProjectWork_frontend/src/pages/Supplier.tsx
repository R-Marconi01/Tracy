import React, { useEffect, useState } from "react";
import ViewDocs from "../components/Supplier/ViewDocs";
import ViewDBRows from "../components/Supplier/ViewDBRows";
import { useAuth } from "../components/ContextWrapper";
import { useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";

const Supplier = () => {
  const [docsTab, setDocsTab] = useState(true);
  const [rowsTab, setRowsTab] = useState(false);
  const [selectedSupplier, setSupplier] = useState(null);
  const { name } = useParams();

  const { backendActor } = useAuth();

  const [docs, setDocs] = useState([]);
  const [info, setInfo] = useState([]);

  const getDocs = async (supplier: any) => {
    const docs = await backendActor.getSuppliersDocuments(Principal.fromText(supplier.principalId));
    setDocs(docs);
  };

  const getInfo = async (supplier: any) => {
    const res = await backendActor.getSupplierInfo(Principal.fromText(supplier.principalId));
    setInfo(res);
  };

  useEffect(() => {
    const getSupplier = async () => {
      const res = await backendActor.getSupplierByName(name);
      setSupplier(res[0]);
    };
    getSupplier();
  }, [name]);

  useEffect(() => {
    if (selectedSupplier) {
      getDocs(selectedSupplier);
      getInfo(selectedSupplier);
    }
  }, [selectedSupplier]);

  const handleDocsTab = () => {
    setDocsTab(true);
    setRowsTab(false);
  };

  const handleDBRowsTab = () => {
    setDocsTab(false);
    setRowsTab(true);
  };
  return (
    <div className="flex flex-col h-screen">
        <h1 className="text-2xl font-semibold text-center">Suppler {name} page</h1>
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

export default Supplier;
