import React, { useState } from 'react';

export const App = () => {
  const [count, setCount] = useState(0);

  ipcRenderer.send('ping', 'PING!!');

  return (
    <div className="container">
      <h1>{count}</h1>
      <button onClick={() => setCount((count) => count + 1)}>Count</button>
    </div>
  );
};
