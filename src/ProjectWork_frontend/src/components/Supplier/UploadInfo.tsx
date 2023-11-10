import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../ContextWrapper";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { uploadFile } from "../../storage-config/functions";

type FormData = {
  companyName: string;
  cityDestination: string;
  cityOrigin: string;
  productType: string;
  quantity: string;
};

const UploadInfo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  const [supplierField, setSupplierField] = useState("");
  const [supplier404, setSupplier404] = useState(false);
  const [supplierFound, setSupplierFound] = useState(false);

  const { identity, backendActor, storageInitiated } = useAuth();

  const schema = z.object({
    companyName: z
      .string()
      .min(2, { message: "Company name must be 2 or more characters long" })
      .max(50, {
        message: "Company name must be less than 50 characters long",
      }),

    cityDestination: z
      .string()
      .min(2, { message: "City destination must be 2 or more characters long" })
      .max(50, {
        message: "City destination must be less than 50 characters long",
      }),

    cityOrigin: z
      .string()
      .min(2, { message: "City origin must be 2 or more characters long" })
      .max(50, { message: "City origin must be less than 50 characters long" }),

    productType: z
      .string()
      .min(2, { message: "Product type must be 2 or more characters long" })
      .max(50, {
        message: "Product type must be less than 50 characters long",
      }),

    quantity: z.number(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const saveDocument = async (e: any) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fileUrl = await uploadAsset(file);

      const document = {
        id: uuidv4(),
        filename: file.name,
        file: fileUrl,
        points: 5,
        filetype: file.type,
        verified: false,
      };
      await backendActor.addDocument(document);
      toast.success("Success!, Your document have been uploaded", {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const handleSaveRowsInfo = async (data: FormData) => {
    try {
      setUploading(true);
      const info = {
        id: uuidv4(),
        companyName: data.companyName,
        cityDestination: data.cityDestination,
        supplier: supplierField,
        cityOrigin: data.cityOrigin,
        productType: data.productType,
        quantity: BigInt(data.quantity),
      };
      const res = await backendActor.addSupplierInfo(info);
      console.log(res);
      toast.success("Success!, Your information have been saved", {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      setUploading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getSuppliers = async () => {
      const response = await backendActor.getAllSuppliers();
      setSuppliers(response);
    };
    getSuppliers();
  }, []);

  const handleSupplierInput = async (e: any) => {
    setSupplierField(e.target.value);
    const supplier = suppliers.find(
      (supplier: any) =>
        supplier.companyName.toLowerCase() === e.target.value.toLowerCase()
    );
    if (!supplier) {
      setSupplier404(true);
    } else {
      setSupplier404(false);
      setSupplierFound(true);
    }
  };

  const uploadAsset = async (file) => {
    if (storageInitiated) {
        const file_path = location.pathname;
        try {
            const assetUrl = await uploadFile(file, file_path);
            console.log("This file was successfully uploaded:", file.name);
            return assetUrl;
        } catch (error) {
            console.error("Error uploading file:", file.name, error);
        }
    }
};
  return (
    <div className="flex flex-col mt-5">
      <form className="flex items-center gap-10">
        <div className="mb-3 w-96">
          <label htmlFor="formFileLg" className="mb-2 inline-block">
            Upload documents PDFs
          </label>
          <div className="flex gap-10">
            <input
              className="block w-96 file:py-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:placeholder-gray-400"
              id="file"
              name="file"
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
            />
            <button
              type="submit"
              onClick={saveDocument}
              className={`py-2 px-5 rounded-md text-white ${
                uploading ? `bg-gray-600` : `bg-blue-500`
              }`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </form>

      <hr className="custom-hr" />
      <div className="mt-5">
        <h1>Upload your company information</h1>
        <div className="max-w-md p-6 bg-white ">
          <form onSubmit={handleSubmit(handleSaveRowsInfo)}>
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                {...register("companyName")}
                className="border border-gray-400 text-gray-700 rounded px-3 py-2 w-full"
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <span className="text-red-600">
                  {errors.companyName.message}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="cityDestination"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                City Destination
              </label>
              <input
                type="text"
                id="cityDestination"
                name="cityDestination"
                {...register("cityDestination")}
                className="border border-gray-400 text-gray-700 rounded px-3 py-2 w-full"
                placeholder="Enter city destination"
              />
              {errors.cityDestination && (
                <span className="text-red-600">
                  {errors.cityDestination.message}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="supplier"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Supplier
              </label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                value={supplierField}
                onChange={handleSupplierInput}
                className="border border-gray-400 text-gray-700 rounded px-3 py-2 w-full"
                required
                placeholder="Enter supplier"
              />
              {supplier404 && (
                <span className="text-green-700">
                  No supplier found with this name on Tracy, but your
                  information will be saved
                </span>
              )}
              {supplierFound && (
                <span className="text-green-700">Supplier found :)</span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="cityOrigin"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                City Origin
              </label>
              <input
                type="text"
                id="cityOrigin"
                name="cityOrigin"
                {...register("cityOrigin")}
                className="border border-gray-400 text-gray-700 rounded px-3 py-2 w-full"
                placeholder="Enter city origin"
              />
              {errors.cityOrigin && (
                <span className="text-red-600">
                  {errors.cityOrigin.message}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="productType"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Product Type
              </label>
              <input
                type="text"
                id="productType"
                name="productType"
                {...register("productType")}
                className="border border-gray-400 text-gray-700 rounded px-3 py-2 w-full"
                placeholder="Enter product type"
              />
              {errors.productType && (
                <span className="text-red-600">
                  {errors.productType.message}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Quantity
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                {...register("quantity", { valueAsNumber: true })}
                className="border border-gray-400 text-gray-700 rounded px-3 py-2 w-full"
                placeholder="Enter quantity"
              />
              {errors.quantity && (
                <span className="text-red-600">{errors.quantity.message}</span>
              )}
            </div>

            <button
              type="submit"
              className={` ${
                uploading ? `bg-gray-600` : `bg-blue-500`
              } text-white font-bold py-2 rounded-md px-10`}
            >
              {uploading ? "Saving your info..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadInfo;
