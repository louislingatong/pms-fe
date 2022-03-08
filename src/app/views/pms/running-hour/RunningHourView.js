import React from 'react';
import {Col, Row} from 'react-bootstrap';
import {Inputs} from 'adminlte-2-react';
import RunningHourForm from '../form/RunningHourForm';

function IntervalDetail({data: vesselMachineryRunningHour}) {
  const {Text} = Inputs;
  return (
    <React.Fragment>
      <Row>
        <Col xs={6}>
          <Row>
            <Col xs={12}>
              <Text
                name="machinery_code"
                id="machineryCodeInput"
                label="Machinery Code"
                labelPosition="above"
                value={vesselMachineryRunningHour.machinery.code_name}
                disabled
              />
            </Col>
            <Col xs={12}>
              <Text
                name="machinery_name"
                id="machineryNameInput"
                label="Machinery Name"
                labelPosition="above"
                value={vesselMachineryRunningHour.machinery.name}
                disabled
              />
            </Col>
          </Row>
        </Col>
        <Col xs={6}>
          <RunningHourForm id={vesselMachineryRunningHour.id}/>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default IntervalDetail;
