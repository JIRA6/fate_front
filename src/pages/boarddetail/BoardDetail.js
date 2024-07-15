import React from 'react';
import { useParams } from "react-router-dom";
import BoardDetailPage from "../../components/boarddetail/BoardDetailPage";
import NotFound from "../../components/global/NotFound";
import "./boarddetail.css";

function BoardDetail() {
  const params = useParams();

  return (
      <>
        {params.id !== undefined
            ? <div className="board-detail-page">
              <BoardDetailPage />
            </div>
            : <NotFound />}
      </>
  );
}

export default BoardDetail;
