import React from 'react';
import { useParams } from "react-router-dom";
import MainPage from "../../components/main/MainPage";
import NotFound from "../../components/global/NotFound";
import "./main.css";

function Main() {
  const params = useParams();

  return (
      <>
        {params.id === undefined
            ? <div className="main-page">
              <MainPage />
            </div>
            : <NotFound />}
      </>
  );
}

export default Main;
