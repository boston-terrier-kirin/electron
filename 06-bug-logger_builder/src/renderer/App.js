import React, { useState, useEffect } from 'react';
import AddLogItem from './components/AddLogItem';
import Alert from './components/Alert';
import LogItem from './components/LogItem';

export const App = () => {
  const [logs, setLogs] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'success',
  });

  useEffect(() => {
    ipcRenderer.send('logs:load');

    ipcRenderer.on('logs:get', (contents) => {
      setLogs(JSON.parse(contents.logs));
    });

    ipcRenderer.on('logs:clear', () => {
      setLogs([]);
      showAlert('Logs Cleared');
    });
  }, []);

  const addItem = (item) => {
    if (item.text === '' || item.user === '' || item.priority === '') {
      showAlert('Please fill in all fields', 'danger', 3000);
      return;
    }

    ipcRenderer.send('logs:add', item);
    showAlert('Log Added');
  };

  const removeItem = (item) => {
    ipcRenderer.send('logs:remove', item._id);
    showAlert('Log Removed');
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
