import React, { useEffect, useState } from "react";
import {
  TERipple,
  TEModal,
  TEModalDialog,
  TEModalContent,
  TEModalHeader,
  TEModalBody,
  TEModalFooter,
} from "tw-elements-react";
import FileModal from "../FileModal";
import { useAuth } from "../ContextWrapper";
import { Principal } from "@dfinity/principal";
import SupplierDocs from "../SupplierDocs";
import SupplierRows from "../SupplierRows";
import { get } from "react-hook-form";

const SupplierInformation = ({
  showSupModal,
  setShowSupModal,
  selectedSupplier,
}) => {
  const { backendActor } = useAuth();
  const [docs, setDocs] = useState([]);
  const [info, setInfo] = useState([]);

  const [docsTab, setDocsTab] = useState(true);
  const [rowsTab, setRowsTab] = useState(false);

  useEffect(() => {
    getRows();
    getDocs();
  }, [selectedSupplier]);

  const getRows = async () => {
    const response = await backendActor.getSupplierInfo(
      Principal.fromText(selectedSupplier.principalId)
    );
    setInfo(response);
  };

  const getDocs = async () => {
    const response = await backendActor.getSuppliersDocuments(
      Principal.fromText(selectedSupplier.principalId)
    );
    setDocs(response);
  };

  const handleDocsTab = () => {
    setDocsTab(true);
    setRowsTab(false);
  };

  const handleDBRowsTab = () => {
    setDocsTab(false);
    setRowsTab(true);
  };

  return (
    <div>
      <TEModal show={showSupModal} setShow={setShowSupModal}>
        <TEModalDialog size="xl">
          <TEModalContent>
            <TEModalHeader className="bg-gray-500">
              <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                {selectedSupplier.companyName} uploaded information
              </h5>
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                onClick={() => {
                  setShowSupModal(false);
                  window.location.reload();
                }}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </TEModalHeader>

            <TEModalBody className="bg-gray-500">
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
              {docsTab && <SupplierDocs {...{ docs }} />}
              {rowsTab && <SupplierRows {...{ info }} />}
            </TEModalBody>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
};

export default SupplierInformation;
