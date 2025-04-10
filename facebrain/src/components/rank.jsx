import React from 'react';


const Rank = ({name, entries }) => {
  return (
    <div>
      <h3>{`${name}, your current entry count is...`}</h3>
      <h1>{entries}</h1>
    </div>
  );
};

export default Rank;