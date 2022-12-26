import React from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import Moment from 'react-moment';

const setVariant = (priority) => {
  if (priority === 'low') {
    return 'bg-success';
  }
  if (priority === 'moderate') {
    return 'bg-warning';
  }
  if (priority === 'high') {
    return 'bg-danger';
  }
};

const LogItem = ({ item, removeItem }) => {
  const handleClick = () => {
    removeItem(item);
  };

  return (
    <tr>
      <td>
        <span className={`badge ${setVariant(item.priority)} text-uppercase`}>
          {item.priority}
        </span>
      </td>
      <td>{item.text}</td>
      <td>{item.user}</td>
      <td>
        <Moment locale="ja" format="llll">
          {new Date(item.created)}
        </Moment>
      </td>
      <td className="text-center">
        <button onClick={handleClick} className="btn btn-sm btn-danger">
          <BsFillTrashFill />
        </button>
      </td>
    </tr>
  );
};

export default LogItem;
