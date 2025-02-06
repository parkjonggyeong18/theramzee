import React from "react";

function GameInfo({ data }) {
  return (
    <div>
      <h2>게임 시작 정보</h2>
      <p>{data.message}</p>
      <pre>{JSON.stringify(data.data, null, 2)}</pre>
    </div>
  );
}

export default GameInfo;
