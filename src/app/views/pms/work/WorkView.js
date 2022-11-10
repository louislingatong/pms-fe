import React, {useEffect, useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import WorkForm from '../form/WorkForm';
import DataTable from '../../../components/DataTable';

function WorkView({rows}) {
  const [lastDoneDate, setLastDoneDate] = useState();

  useEffect(() => {
    const lastDoneDates = Object.values(rows).map(row => row.current_work.last_done);
    const uniqueLastDoneDates = [...new Set(lastDoneDates)];
    if (uniqueLastDoneDates.length && uniqueLastDoneDates.length === 1) {
      setLastDoneDate(uniqueLastDoneDates[0]);
    }
  }, []);

  const header = [
    {
      title: 'Code',
      data: 'code',
    },
    {
      title: 'Sub Category',
      data: 'sub_category',
      render: subCategory => subCategory.name,
    },
    {
      title: 'Description',
      data: 'description',
      render: description => description.name,
    },
    {
      title: 'Intervals',
      data: 'interval',
      render: interval => `${interval.value} ${interval.unit.name}`,
    },
    {
      title: 'Commissioning Date',
      data: 'installed_date',
    },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col xs={8}>
          <DataTable
            data={Object.values(rows)}
            columns={header}
            selectedRowIds={[]}
            striped
            hover
            responsive
            fixed
            border
          />
        </Col>
        <Col xs={4}>
          <WorkForm ids={Object.keys(rows).map(Number)} lastDoneDate={lastDoneDate}/>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default WorkView;
