import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuDropdown from "./MenuDropdown";
import { useAuth } from "./ContextWrapper";
import SetupModal from "./SetUpModal";
import { toast } from "react-toastify";

type Result = {
  err?: any;
  ok?: any;
};

const Navbar = () => {
  const {
    login,
    logout,
    isAuthenticated,
    identity,
    backendActor,
    user,
    setUser,
    setIsAdmin,
    isAdmin,
  } = useAuth();
  const [isNew, setIsNew] = useState(false);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated && identity)
      (async () => {
        try {
          const res: Result = await backendActor?.getUser();
          const myrole = await backendActor?.my_role();
          if (myrole === "admin") {
            setIsAdmin(true);
          }
          if (res.ok) {
            setUser(res.ok);
          } else {
            if (res.err === "User not found") {
              setIsNew(true);
              navigate("/");
            }
          }
        } catch (error) {
          console.log("Error in Navbar", error);
        }
      })();
  }, [identity]);

  const handleOnSelection = async (option: string, companyName: string) => {

    try {
      setSaving(true);
      if (option === "supplier") {
        let user = {
          isSupplier: true,
          isFashion: false,
          companyName: companyName,
          principalId: identity?.getPrincipal().toString(),
          points: 0,
          created: BigInt(Date.now()),
        };
        await backendActor.addUser(user);
        toast.success(
          "That's all, thank you. You can start uploading your information",
          {
            autoClose: 7000,
            position: "top-center",
            hideProgressBar: true,
          }
        );
        setSaving(false);
        window.location.reload();
      } else if (option === "fashionHouse") {
        let user = {
          isSupplier: false,
          isFashion: true,
          companyName: companyName,
          points: 0,
          principalId: identity?.getPrincipal().toString(),
          created: BigInt(Date.now()),
        };
        await backendActor.addUser(user);
        toast.success(
          "That's all, thank you. You can start uploading your information",
          {
            autoClose: 7000,
            position: "top-center",
            hideProgressBar: true,
          }
        );
        setSaving(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  return (
    <div className=" p-4 md:p-6 flex items-center justify-between">
      <div className="w-1/3">
        <h1 className="text-3xl font-bold ">Tracy</h1>
      </div>
      <ul className="hidden md:flex items-center w-2/3 justify-end gap-2 md:gap-5">
        <li>
          <Link to="/" className=" hover:underline">
            Home
          </Link>
        </li>
        {isAuthenticated && (
          <>
            {user?.isSupplier  && (
              <li>
                <Link
                  to="/supplier"
                  className=" hover:underline whitespace-nowrap"
                >
                  Supplier Portal
                </Link>
              </li>
            )}
            {user?.isFashion && (
              <li>
                <Link
                  to="/fashion-house"
                  className=" hover:underline whitespace-nowrap"
                >
                  Fashion House Interface
                </Link>
              </li>
            )}
          </>
        )}
        <li>
          <Link to="/consumer" className=" hover:underline whitespace-nowrap">
            Consumer Interface
          </Link>
        </li>
        <li>
          <Link
            to="/made-in-italy"
            className=" hover:underline whitespace-nowrap"
          >
            Made in Italy Ranking
          </Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/dashboard" className=" hover:underline">
              Dashboard
            </Link>
          </li>
        )}
        <li>
          {!isAuthenticated && (
            <button
              onClick={async () => {
                login();
              }}
              className="bg-green-500 px-2 py-1.5 rounded-md  hover:bg-green-600 transition duration-300"
            >
              Login
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="bg-green-500 px-2 py-1.5 rounded-md  hover:bg-green-600 transition duration-300"
            >
              Logout
            </button>
          )}
        </li>
      </ul>
      <MenuDropdown {...{isAdmin, user, isAuthenticated }} />
      {isNew && !isAdmin && (
        <SetupModal
          isNew={isNew}
          onSelection={handleOnSelection}
          saving={saving}
        />
      )}
    </div>
  );
};

export default Navbar;
