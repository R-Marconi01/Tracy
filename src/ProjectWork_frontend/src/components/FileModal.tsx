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
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const FileModal = ({ showModal, setShowModal, modalDoc }) => {
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (modalDoc.filetype.includes("/pdf")) {
      setIsPdf(true);
    } else {
      setIsPdf(false);
    }
  }, [modalDoc]);

  const newPlugin = defaultLayoutPlugin();
  return (
    <div>
      <TEModal show={showModal} setShow={setShowModal}>
        <TEModalDialog size="xl">
          <TEModalContent>
            <TEModalHeader className="bg-gray-500">
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                onClick={() => setShowModal(false)}
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
              
                {isPdf ? (
                  <div
                  className="mx-auto "
                  style={{
                    width: "900px",
                    height: "900px",
                    overflow: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    {modalDoc && (
                      <Viewer fileUrl={modalDoc.file} plugins={[newPlugin]} />
                    )}
                  </Worker>
                </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={modalDoc.file}
                      alt="ID"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                )}
            </TEModalBody>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
};

export default FileModal;
