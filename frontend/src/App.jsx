import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "../src/app/authSlice";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
