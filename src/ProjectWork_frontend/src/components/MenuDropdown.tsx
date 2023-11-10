import React, { useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuth } from "./ContextWrapper";

const MenuDropdown = ({ isAdmin, user, isAuthenticated }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { login, logout } = useAuth();

  const handleClickOutside = (event: any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex md:hidden w-2/3 justify-end">
      <div ref={menuRef} className="md:hidden relative inline-block text-left">
        <div>
          <button type="button" onClick={() => setOpen(!open)}>
            <AiOutlineMenu size={25} />
          </button>
        </div>
        {open && (
          <div
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              <Link
                to="/"
                className="text-gray-700 block px-4 py-2 text-sm"
                role="menuitem"
                id="menu-item-0"
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  {user?.isSupplier && (
                    <Link
                      to="/supplier"
                      className="text-gray-700 block px-4 py-2 text-sm"
                      role="menuitem"
                      id="menu-item-1"
                    >
                      Supplier Portal
                    </Link>
                  )}

                  {user?.isFashion && (
                    <Link
                      to="/fashion-house"
                      className="text-gray-700 block px-4 py-2 text-sm"
                      role="menuitem"
                      id="menu-item-2"
                    >
                      Fashion House Interface
                    </Link>
                  )}
                </>
              )}
              <Link
                to="/consumer"
                className="text-gray-700 block px-4 py-2 text-sm"
                role="menuitem"
                id="menu-item-2"
              >
                Consumer Interface
              </Link>
              <Link
                to="/made-in-italy"
                className="text-gray-700 block px-4 py-2 text-sm"
                role="menuitem"
                id="menu-item-2"
              >
                Made in Italy Ranking
              </Link>
              {isAdmin && (
                <Link
                  to="/dashboard"
                  className="text-gray-700 block px-4 py-2 text-sm"
                  role="menuitem"
                  id="menu-item-2"
                >
                  Dashboard
                </Link>
              )}
              {!isAuthenticated && (
                <button
                  onClick={async () => {
                    login();
                  }}
                  className="text-gray-700 block w-full px-4 py-2 text-left text-sm"
                  role="menuitem"
                  id="menu-item-3"
                >
                  Login
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={async () => {
                    logout();
                  }}
                  className="text-gray-700 block w-full px-4 py-2 text-left text-sm"
                  role="menuitem"
                  id="menu-item-3"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDropdown;
