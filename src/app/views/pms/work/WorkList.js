import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {workDoneList, workList, metaData, reqListStatus, workListAsync} from '../../../store/workSlice';
import {activeVesselSubMenu} from '../../../store/navbarMenuSlice';
import {Box, Button, Col, Content, Row, Inputs} from 'adminlte-2-react';
import DataTable from '../../../components/DataTable';
import {usePrevious} from '../../../utils/Hooks';
import {Divider, Modal} from '../../../components';
import WorkView from './WorkView';
import VesselDepartmentSelect from '../../../components/select/VesselDepartmentSelect';
import MachinerySelect from '../../../components/select/MachinerySelect';

function WorkList({name}) {
  const {Select2} = Inputs;
  const history = useHistory();
  const dispatch = useDispatch();

  const activeVessel = useSelector(activeVesselSubMenu);
  const workDone = useSelector(workDoneList);
  const works = useSelector(workList);
  const meta = useSelector(metaData);
  const status = useSelector(reqListStatus);

  const isLoading = status === 'loading';

  const [localWorkDone, setLocalWorkDone] = useState([]);
  const [localWorks, setLocalWorks] = useState(works);
  const [workHistory, setWorkHistory] = useState([]);
  const [workModalShow, setWorkModalShow] = useState(false);
  const [workHistoryModalShow, setWorkHistoryModalShow] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  const [params, setParams] = useState({vessel: activeVessel.name});
  const [filters, setFilters] = useState({});

  const prevWorks = usePrevious(localWorks);
  const prevWorkDone = usePrevious(localWorkDone);
  const prevParams = usePrevious(params);
  const prevFilters = usePrevious(filters);

  useEffect(() => {
    const state = history.location.state || {};
    if ('status' in state) {
      const newState = {...state};
      delete newState.status;
      history.replace({...history.location, newState});
    }
    if (activeVessel && activeVessel.id) {
      setFilters({status: state.status})
    }
  }, []);

  useEffect(() => {
    if (activeVessel && activeVessel.id && !localWorks.length) {
      setParams({vessel: activeVessel.name});
    }
  }, [activeVessel]);

  useEffect(() => {
    if (prevWorks) {
      setLocalWorks(works);
    }
  }, [works]);

  useEffect(() => {
    if (prevWorkDone) {
      setLocalWorkDone(workDone);
      handleWorkModalClose();
      initList();
    }
  }, [workDone]);

  useEffect(() => {
    if (prevParams && prevFilters) {
      initList();
    }
  }, [params, filters]);

  const initList = () => {
    dispatch(workListAsync({...params, ...filters}));
  };

  const handleRowSelect = (selectedRow) => {
    let newSelectedRows = {...selectedRows};
    if (selectedRow.action === 'checked') {
      newSelectedRows[selectedRow.id] = findWork(selectedRow.id);
    } else if (selectedRow.action === 'unchecked') {
      delete newSelectedRows[selectedRow.id];
    } else if (selectedRow.action === 'checked_all') {
      selectedRow.ids.forEach((id) => {
        newSelectedRows[id] = findWork(id);
      });
    } else if (selectedRow.action === 'unchecked_all') {
      selectedRow.ids.forEach((id) => {
        delete newSelectedRows[id];
      });
    }
    setSelectedRows(newSelectedRows);
  };

  const findWork = (id) => localWorks.find((localWork) => localWork.id === id);

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

  const handleWorkModalOpen = () => {
    setWorkModalShow(true);
  };

  const handleWorkModalClose = () => {
    setSelectedRows({});
    setWorkModalShow(false);
  };

  const handleWorkHistoryModalOpen = () => {
    setWorkHistoryModalShow(true);
  };

  const handleWorkHistoryModalClose = () => {
    setWorkHistoryModalShow(false);
  };

  const viewWorkHistory = (work) => {
    setWorkHistory(work.work_history);
    handleWorkHistoryModalOpen();
  }

  const handleFilterChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const newFilters = {...filters};
    !!value ? newFilters[name] = value : delete newFilters[name];

    setFilters(newFilters);
  };

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
      title: 'Date Installed',
      data: 'installed_date',
    },
    {
      title: 'Last Done',
      data: 'current_work',
      render: currentWork => currentWork.last_done,
    },
    {
      title: 'Due Date',
      data: 'due_date',
    },
    {
      title: 'Status',
      data: 'status',
    },
    {
      title: 'Instructions',
      data: 'instructions',
      render: (instruction, row) => row.current_work.instructions,
    },
    {
      title: 'Remarks',
      data: 'remarks',
      render: (remarks, row) => row.current_work.remarks,
    },
    {
      title: '',
      data: 'action',
      render: (action, row) => <Button type="primary" icon="fas-history" onClick={() => viewWorkHistory(row)}/>,
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
                    value={filters.department}
                    onChange={handleFilterChange}
                  />
                </Col>
                <Col xs={12} sm={4} md={6} lg={4}>
                  <MachinerySelect
                    name="machinery"
                    id="machineryFilterSelect"
                    placeholder="Machinery"
                    allowClear={true}
                    value={filters.machinery}
                    onChange={handleFilterChange}
                  />
                </Col>
                <Col xs={12} sm={4} md={3} lg={2}>
                  <Select2
                    name="status"
                    id="statusFilterSelect"
                    placeholder="Status"
                    labelPosition="none"
                    options={['WARNING','DUE','OVERDUE']}
                    allowClear={true}
                    value={filters.status}
                    onChange={handleFilterChange}
                  />
                </Col>
                <Col xs={12}>
                  <Divider type="line"/>
                </Col>
                <Col xs={12}>
                  <DataTable
                    api
                    data={localWorks}
                    columns={header}
                    selectedRowIds={Object.keys(selectedRows).map(Number)}
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
                    multiple
                    onSelect={handleRowSelect}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onPageLengthChange={handlePageLengthChange}
                    isLoading={isLoading}
                  />
                </Col>
                <Divider />
                <Col xs={12}>
                  {
                    !!Object.keys(selectedRows).length
                    && <Button type="primary" text="Work" onClick={handleWorkModalOpen} pullRight/>
                  }
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
        <Modal
          show={workModalShow}
          title='Work'
          modalSize="lg"
          closeButton
          onHide={handleWorkModalClose}
        >
          <WorkView rows={selectedRows} />
        </Modal>
        <Modal
          show={workHistoryModalShow}
          title='Work History'
          modalSize="sm"
          closeButton
          onHide={handleWorkHistoryModalClose}
        >
          <Row>
            <Col xs={12}>
              <Row>
                <Col xs={6}><label>Encode Date</label></Col>
                <Col xs={6}><label>Encode By</label></Col>
              </Row>
            </Col>
            <Col xs={12}><Divider type="line" /></Col>
            {
              workHistory.map((work) => (
                <React.Fragment>
                  <Col xs={12}>
                    <Row>
                      <Col xs={6}>{work.created_at}</Col>
                      <Col xs={6}>{work.creator}</Col>
                    </Row>
                  </Col>
                  <Col xs={12}><Divider type="line" /></Col>
                </React.Fragment>
              ))
            }
          </Row>
        </Modal>
      </Content>
    </React.Fragment>
  )
}

export default WorkList;
