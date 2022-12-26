import React, { useState } from 'react';

const AddLogItem = ({ addItem }) => {
  const [text, setText] = useState('');
  const [user, setUser] = useState('');
  const [priority, setPriority] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    addItem({
      _id: Math.floor(Math.random() * 1000),
      text,
      user,
      priority,
      created: new Date().toString(),
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Log"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>
          <div className="d-flex gap-3 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="User"
              value={user}
              onChange={(event) => setUser(event.target.value)}
            />
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="form-select"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary">Add Log</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLogItem;
