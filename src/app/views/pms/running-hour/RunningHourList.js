import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  metaData,
  reqListStatus,
  runningHourData,
  runningHourList,
  runningHourListAsync
} from '../../../store/runningHourSlice';
import {activeVesselSubMenu} from '../../../store/navbarMenuSlice';
import {Box, Button, Col, Content, Row} from 'adminlte-2-react';
import DataTable from '../../../components/DataTable';
import {usePrevious} from '../../../utils/Hooks';
import {Divider, Modal} from '../../../components';
import VesselMachineryRunningHour from '../../../core/models/VesselMachineryRunningHour';
import RunningHourDetail from './RunningHourView';
import VesselDepartmentSelect from '../../../components/select/VesselDepartmentSelect';

function RunningHourList({name}) {
  const dispatch = useDispatch();

  const activeVessel = useSelector(activeVesselSubMenu);
  const runningHour = useSelector(runningHourData);
  const runningHours = useSelector(runningHourList);
  const meta = useSelector(metaData);
  const status = useSelector(reqListStatus);

  const isLoading = status === 'loading';

  const [localVesselMachineryRunningHour, setLocalVesselMachineryRunningHour] = useState(new VesselMachineryRunningHour());
  const [localVesselMachineryRunningHours, setLocalVesselMachineryRunningHours] = useState(runningHours);
  const [runningHourHistory, setRunningHourHistory] = useState([]);
  const [runningHourModalShow, setRunningHourModalShow] = useState(false);
  const [runningHourHistoryModalShow, setRunningHourHistoryModalShow] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [params, setParams] = useState({vessel: activeVessel.name});
  const [filters, setFilters] = useState({});

  const prevVesselMachineryRunningHours = usePrevious(localVesselMachineryRunningHours);
  const prevLocalVesselMachineryRunningHour = usePrevious(localVesselMachineryRunningHour);
  const prevParams = usePrevious(params);
  const prevFilters = usePrevious(filters);

  useEffect(() => {
    if (activeVessel && activeVessel.id) {
      setParams({vessel: activeVessel.name});
    }
  }, [activeVessel]);

  useEffect(() => {
    if (prevVesselMachineryRunningHours) {
      setLocalVesselMachineryRunningHours(runningHours);
    }
  }, [runningHours]);

  useEffect(() => {
    if (prevLocalVesselMachineryRunningHour) {
      setLocalVesselMachineryRunningHour(runningHour);
      handleRunningHourModalClose();
      initList();
    }
  }, [runningHour]);

  useEffect(() => {
    if (prevLocalVesselMachineryRunningHour
      && (prevLocalVesselMachineryRunningHour.id !== localVesselMachineryRunningHour.id)
      && !!localVesselMachineryRunningHour.id) {
      handleRunningHourModalOpen();
    }
  }, [localVesselMachineryRunningHour]);

  useEffect(() => {
    if (prevParams && prevFilters) {
      initList();
    }
  }, [params, filters]);

  const initList = () => {
    dispatch(runningHourListAsync({...params, ...filters}));
  };

  const handleRowSelect = (selectedRow) => {
    let newSelectedRowIds = selectedRowIds.slice();
    if (selectedRow.action === 'checked') {
      newSelectedRowIds.push(selectedRow.id);
    } else if (selectedRow.action === 'unchecked') {
      const i = newSelectedRowIds.indexOf(selectedRow);
      newSelectedRowIds.splice(i, 1)
    } else if (selectedRow.action === 'checked_all') {
      newSelectedRowIds = selectedRow.ids;
    } else if (selectedRow.action === 'unchecked_all') {
      newSelectedRowIds = [];
    } else {
      newSelectedRowIds = [selectedRow.id];
      setLocalVesselMachineryRunningHour(selectedRow);
    }
    setSelectedRowIds(newSelectedRowIds);
  };

  const handlePageChange = (page) => {
    setParams({...params, page});
  };

  const handlePageLengthChange = (limit) => {
    setParams({...params, page: 1, limit});
  };

  const handleSearchChange = (keyword) => {
    const {vessel} = params;
    keyword
      ? setParams({vessel, keyword})
      : setParams({vessel});
  };

  const handleRunningHourModalOpen = () => {
    setRunningHourModalShow(true);
  };

  const handleRunningHourModalClose = () => {
    setSelectedRowIds([]);
    setLocalVesselMachineryRunningHour(new VesselMachineryRunningHour());
    setRunningHourModalShow(false);
  };

  const handleRunningHourHistoryModalOpen = () => {
    setRunningHourHistoryModalShow(true);
  };

  const handleRunningHourHistoryModalClose = () => {
    setRunningHourHistoryModalShow(false);
  };

  const viewRunningHourHistory = (runningHour) => {
    setRunningHourHistory(runningHour.running_hour_history);
    handleRunningHourHistoryModalOpen();
  }

  const handleFilterChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFilters(prevState => {
      const newState = {...prevState};
      !!value ? newState[name] = value : delete newState[name];
      return newState;
    });
  };

  const header = [
    {
      title: 'Machinery Code',
      data: 'code',
      render: (code, row) => row.machinery.code_name,
    },
    {
      title: 'Machinery Name',
      data: 'machinery',
      render: machinery => machinery.name,
    },
    {
      title: 'Running Hours',
      data: 'running_hour',
      render: (runningHour, row) => row.current_running_hour.running_hours,
    },
    {
      title: 'Updating Date',
      data: 'updating_date',
      render: (updatingDate, row) => row.current_running_hour.updating_date,
    },
    {
      title: 'Encoded Date',
      data: 'create_at',
      render: (createdAt, row) => row.current_running_hour.created_at,
    },
    {
      title: '',
      data: 'action',
      render: (action, row) => <Button type="primary" icon="fas-history" onClick={() => viewRunningHourHistory(row)}/>,
    },
  ];

  return (
    <React.Fragment>
      <Content title={name} browserTitle={name}>
        <Row>
          <Col xs={12}>
            <Box>
              <Row>
                <Col xs={12} sm={4} md={3} lg={2}>
                  <VesselDepartmentSelect
                    name="department"
                    id="departmentFilterSelect"
                    placeholder="Department"
                    allowClear={true}
                    onChange={handleFilterChange}
                  />
                </Col>
                <Col xs={12}>
                  <Divider type="line"/>
                </Col>
                <Col xs={12}>
                  <DataTable
                    api
                    data={localVesselMachineryRunningHours}
                    columns={header}
                    selectedRowIds={selectedRowIds}
                    options={{
                      page: true,
                      pageInfo: true,
                      pageLength: true,
                      search: true,
                    }}
                    hover
                    striped
                    fixed
                    responsive
                    border
                    meta={meta}
                    rowSelect
                    onSelect={handleRowSelect}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onPageLengthChange={handlePageLengthChange}
                    isLoading={isLoading}
                  />
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
        <Modal
          show={runningHourModalShow}
          title='Update Running Hours'
          modalSize="md"
          closeButton
          onHide={handleRunningHourModalClose}
        >
          <RunningHourDetail data={localVesselMachineryRunningHour}/>
        </Modal>
        <Modal
          show={runningHourHistoryModalShow}
          title='Work History'
          modalSize="sm"
          closeButton
          onHide={handleRunningHourHistoryModalClose}
        >
          <Row>
            <Col xs={12}>
              <Row>
                <Col xs={6}><label>Encode Date</label></Col>
                <Col xs={6}><label>Encode By</label></Col>
              </Row>
            </Col>
            <Col xs={12}><Divider type="line"/></Col>
            {
              runningHourHistory.map((runningHour) => (
                <React.Fragment>
                  <Col xs={12}>
                    <Row>
                      <Col xs={6}>{runningHour.created_at}</Col>
                      <Col xs={6}>{runningHour.creator}</Col>
                    </Row>
                  </Col>
                  <Col xs={12}><Divider type="line"/></Col>
                </React.Fragment>
              ))
            }
          </Row>
        </Modal>
      </Content>
    </React.Fragment>
  )
}

export default RunningHourList;
