import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Content, Infobox2} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import {workCount, workCountAsync} from '../store/workSlice';
import {activeVesselSubMenu} from '../store/navbarMenuSlice';
import {usePrevious} from '../utils/Hooks';

function Dashboard(props) {
  const {name} = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const activeVessel = useSelector(activeVesselSubMenu);
  const count = useSelector(workCount);

  const [localCount, setLocalCount] = useState(count);
  const [params, setParams] = useState({vessel: activeVessel.name});

  const prevParams = usePrevious(params);

  useEffect(() => {
    if (activeVessel && activeVessel.id) {
      setParams({vessel: activeVessel.name});
    }
  }, [activeVessel]);

  useEffect(() => {
    if (count) {
      setLocalCount(count);
    }
  }, [count]);

  useEffect(() => {
    if (prevParams) {
      initCount();
    }
  }, [params]);

  const initCount = () => {
    dispatch(workCountAsync(params));
  }

  const redirect = (status) => {
    history.push('/works', {status});
  }

  return (
    <Content title={name} browserTitle={name}>
      <Row>
        <Col xs={4}>
          <Infobox2 icon="fas-cog" title={localCount.warning} text="Works to be done" color="yellow"
                    footerText="View List"
                    to="javascript:" onFooterClick={() => redirect('WARNING')}/>
        </Col>
        <Col xs={4}>
          <Infobox2 icon="fas-screwdriver" title={localCount.due} text="Due works" color="light-blue"
                    footerText="View List"
                    to="javascript:" onFooterClick={() => redirect('DUE')}/>
        </Col>
        <Col xs={4}>
          <Infobox2 icon="fas-wrench" title={localCount.overdue} text="Overdue works" color="red" footerText="View List"
                    to="javascript:" onFooterClick={() => redirect('OVERDUE')}/>
        </Col>
      </Row>
    </Content>
  );
}

export default Dashboard;
