import React, { useEffect, useState } from "react";
import { useAuth } from "../ContextWrapper";
import { toast } from "react-toastify";

const DocumentRow = ({ doc, handleModalOpen, index }) => {
  const { backendActor } = useAuth();
  const [points, setPoints] = useState(Number(doc.points));
  const [saveButton, setSaveButton] = useState(false);
  const [saving, setSaving] = useState(false);

  const increasePoints = () => {
    setPoints(points + 1);
  };

  const reducePoints = () => {
    setPoints(points - 1);
  };

  const handleUpdatePoints = async () => {
    try {
      setSaving(true);
      let updatedDocumet = {
        ...doc,
        points: points < 0 ? 0 : points,
      };
      await backendActor.updateDocument(updatedDocumet);

      toast.success(`Points for document ${doc.filename} have been updated`, {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      setSaveButton(false);
      setSaving(false);
    } catch (error) {
      console.log(error);
      toast.error(`Something went wrong`, {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      setSaving(false);
    }
  };

  useEffect(() => {
    if (points !== Number(doc.points)) {
      setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [points, doc]);

  return (
    <tr className="border-b dark:border-neutral-500">
      <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
      <td className="whitespace-nowrap px-6 py-4">{doc.filename}</td>
      <td className="whitespace-nowrap px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => handleModalOpen(doc)}
          className="px-2 py-1.5 rounded-md bg-blue-500 text-white"
        >
          View
        </button>
      </td>
      <td className=" px-6 py-4 ">
        <button
          onClick={reducePoints}
          className="px-2 py-1.5 whitespace-nowrap rounded-md bg-blue-500 text-white"
        >
          Reduce Points
        </button>
        <button
          onClick={increasePoints}
          className="px-2 py-1.5 ml-3 whitespace-nowrap rounded-md bg-blue-500 text-white"
        >
          Increase Points
        </button>
      </td>
      <td className=" px-6 py-4 ">{points}</td>
      <td className=" px-6 py-4 ">
        {saveButton && (
          <button
            onClick={handleUpdatePoints}
            className="px-2 py-1.5 rounded-md bg-green-600 text-white"
          >
            {saving ? "Saving..." : "Save points"}
          </button>
        )}
      </td>
    </tr>
  );
};

export default DocumentRow;
