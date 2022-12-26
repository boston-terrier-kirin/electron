import React, { useState } from 'react';
import AddLogItem from './components/AddLogItem';
import Alert from './components/Alert';
import LogItem from './components/LogItem';

export const App = () => {
  const [logs, setLogs] = useState([
    {
      _id: 1,
      text: 'This is log one',
      priority: 'low',
      user: 'Brad',
      created: new Date().toString(),
    },
    {
      _id: 2,
      text: 'This is log two',
      priority: 'moderate',
      user: 'Kate',
      created: new Date().toString(),
    },
    {
      _id: 3,
      text: 'This is log three',
      priority: 'high',
      user: 'John',
      created: new Date().toString(),
    },
  ]);

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'success',
  });

  const addItem = (item) => {
    if (item.text === '' || item.user === '' || item.priority === '') {
      showAlert('Please fill in all fields', 'danger', 3000);
      return;
    }

    setLogs((prev) => [item, ...prev]);
    showAlert('Log added');
  };

  const removeItem = (item) => {
    const newLogs = logs.filter((log) => log._id !== item._id);
    setLogs(newLogs);
    showAlert('Log removed');
  };

  const showAlert = (message, variant = 'success', seconds = 3000) => {
    setAlert({
      show: true,
      message,
      variant,
    });

    setTimeout(() => {
      setAlert({
        show: false,
        message: '',
        variant: '',
      });
    }, 3000);
  };

  const rowsToRender = logs.map((row) => (
    <LogItem key={row._id} item={row} removeItem={removeItem} />
  ));

  return (
    <div className="container p-3">
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <AddLogItem addItem={addItem} />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="bg-light">Priority</th>
            <th className="bg-light">Log Text</th>
            <th className="bg-light">User</th>
            <th className="bg-light">Created</th>
            <th className="bg-light"></th>
          </tr>
        </thead>
        <tbody>{rowsToRender}</tbody>
      </table>
    </div>
  );
};
