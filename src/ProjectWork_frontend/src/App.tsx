import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout';
import Home from './pages/Home';
import SupplierPortal from './pages/SupplierPortal';
import Consumer from './pages/Consumer';
import MadeInItaly from './pages/MadeInItaly';
import Dashboard from './pages/Dashboard';
import FashionHouse from "./pages/FashionHouse";
import { useAuth } from "./components/ContextWrapper";
import { useEffect } from "react";
import { initActors } from './storage-config/functions';
import Supplier from "./pages/Supplier";

const App = () => {

  const {checkAuth, setStorageInitiated, isAuthenticated, storageInitiated} = useAuth();

  const init = async () => {
      const res = await initActors();
      if (res) {
          setStorageInitiated(true)
      }
    };

  useEffect(() => {
    checkAuth();
    init();
  }, []);
  
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/supplier" element={<SupplierPortal />} />
        <Route path="/fashion-house" element={<FashionHouse />} />
        <Route path="/consumer" element={<Consumer />} />
        <Route path="/made-in-italy" element={<MadeInItaly />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="supplier/:name" element={<Supplier />} />
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App