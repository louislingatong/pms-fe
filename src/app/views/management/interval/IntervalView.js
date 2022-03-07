import React from 'react';
import IntervalForm from '../form/IntervalForm';

function IntervalView({data: localInterval}) {
  return (
    <React.Fragment>
      <IntervalForm data={localInterval}/>
    </React.Fragment>
  );
}

export default IntervalView;
