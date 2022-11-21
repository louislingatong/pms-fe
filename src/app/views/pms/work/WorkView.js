import React, {useEffect, useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import WorkForm from '../form/WorkForm';
import DataTable from '../../../components/DataTable';

function WorkView({rows}) {
  const [lastDoneDate, setLastDoneDate] = useState();
  const [instructions, setInstructions] = useState();
  const [remarks, setRemarks] = useState();

  useEffect(() => {
    console.log(rows);
    let tempLastDone = [];
    let tempInstructions = [];
    let tempRemarks = [];
    Object.values(rows).forEach((row) => {
      if (!tempLastDone.includes(row.current_work.last_done)) {
        tempLastDone.push(row.current_work.last_done)
      }
      if (!tempInstructions.includes(row.current_work.instructions)) {
        tempInstructions.push(row.current_work.instructions)
      }
      if (!tempRemarks.includes(row.current_work.remarks)) {
        tempRemarks.push(row.current_work.remarks)
      }
    })
    if (tempLastDone.length && tempLastDone.length === 1) {
      setLastDoneDate(tempLastDone[0]);
    }
    if (tempInstructions.length && tempInstructions.length === 1) {
      setInstructions(tempInstructions[0]);
    }
    if (tempRemarks.length && tempRemarks.length === 1) {
      setRemarks(tempRemarks[0]);
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
          <WorkForm ids={Object.keys(rows).map(Number)}
                    lastDoneDate={lastDoneDate}
                    instructions={instructions}
                    remarks={remarks}/>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default WorkView;
