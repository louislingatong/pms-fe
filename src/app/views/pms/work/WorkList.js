import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {
  reqListStatus,
  workDoneList,
  workList,
  workMeta,
  workListAsync,
  workHistoryExportAsync,
  worksExportAsync,
  fileDownloadAsync
} from '../../../store/workSlice';
import {profileData} from '../../../store/profileSlice';
import {activeVessel as defaultActiveVessel} from '../../../store/navbarMenuSlice';
import {Box, Button, Col, Content, Inputs, Row} from 'adminlte-2-react';
import DataTable from '../../../components/DataTable';
import {usePrevious} from '../../../utils/Hooks';
import {Divider, Modal} from '../../../components';
import WorkView from './WorkView';
import VesselDepartmentSelect from '../../../components/select/VesselDepartmentSelect';
import MachinerySelect from '../../../components/select/MachinerySelect';
import VesselMachinerySubCategoryWork from '../../../core/models/VesselMachinerySubCategoryWork';

function WorkList({name}) {
  const {Select2} = Inputs;
  const history = useHistory();
  const dispatch = useDispatch();

  const activeVessel = useSelector(defaultActiveVessel);
  const workDone = useSelector(workDoneList);
  const works = useSelector(workList);
  const metaData = useSelector(workMeta);
  const status = useSelector(reqListStatus);
  const profile = useSelector(profileData);

  const isLoading = status === 'loading';

  const [localWorkDone, setLocalWorkDone] = useState([]);
  const [localWorks, setLocalWorks] = useState(works);
  const [selectedWork, setSelectedWork] = useState(new VesselMachinerySubCategoryWork());
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
    if (activeVessel && activeVessel.id) {
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
    setSelectedWork(work);
    handleWorkHistoryModalOpen();
  }

  const handleFilterChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const newFilters = {...filters};
    !!value ? newFilters[name] = value : delete newFilters[name];

    setFilters(newFilters);
  };

  const handleExportWorks = () => {
    dispatch(worksExportAsync({...params, ...filters}));
  };

  const handleExportWorkHistory = () => {
    dispatch(workHistoryExportAsync(selectedWork.id));
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
      render: interval => interval.name,
    },
    {
      title: 'Commissioning Date',
      data: 'installed_date',
    },
    {
      title: 'Last Done (DD-MMM-YYYY)',
      data: 'last_done',
      render: (lastDone, row) => row.current_work.last_done,
    },
    {
      title: 'Last Done (Run Hours)',
      data: 'running_hours',
      render: (runningHours, row) => row.current_work.running_hours,
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
      render: (action, row) => (
        !!profile.permissions['jobs_history_show']
        && <Button type="primary" icon="fas-history" onClick={() => viewWorkHistory(row)}/>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Content title={name} browserTitle={`ASTRO | PMS - ${name}`}>
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
                    filter={filters}
                    onChange={handleFilterChange}
                  />
                </Col>
                <Col xs={12} sm={4} md={3} lg={2}>
                  <Select2
                    name="status"
                    id="statusFilterSelect"
                    placeholder="Status"
                    labelPosition="none"
                    options={['WARNING', 'DUE', 'OVERDUE', 'JOBS DONE', 'DRY DOCK']}
                    allowClear={true}
                    value={filters.status}
                    onChange={handleFilterChange}
                  />
                </Col>
                <Col xs={12}>
                  <Divider type="line"/>
                </Col>
                <Col xs={12}>
                  {
                    !!profile.permissions['jobs_export']
                      && <Button
                            type="primary"
                            text="Export"
                            onClick={handleExportWorks}
                            pullRight/>
                  }
                </Col>
                <Col xs={12}>
                  <Divider/>
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
                    meta={metaData}
                    multiple
                    onSelect={handleRowSelect}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onPageLengthChange={handlePageLengthChange}
                    isLoading={isLoading}
                  />
                </Col>
                <Divider/>
                <Col xs={12}>
                  {
                    !!Object.keys(selectedRows).length
                    && !!profile.permissions['jobs_show']
                    && <Button type="primary"
                               text={`Update Job${Object.keys(selectedRows).length > 1 ? 's' : ''}`}
                               onClick={handleWorkModalOpen} pullRight/>
                  }
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
        <Modal
          show={workModalShow}
          title='Job'
          modalSize="lg"
          closeButton
          onHide={handleWorkModalClose}
        >
          <WorkView rows={selectedRows}/>
        </Modal>
        <Modal
          show={workHistoryModalShow}
          title='Job History'
          modalSize="lg"
          closeButton
          onHide={handleWorkHistoryModalClose}
        >
          <Row>
            <Col xs={12}>
              {
                !!profile.permissions['jobs_history_export']
                  && <Button
                    type="primary"
                    text="Export"
                    onClick={handleExportWorkHistory}
                    pullRight
                  />
              }
            </Col>
            <Col xs={12}>
              <Row>
                <Col xs={2}><label>Code</label></Col>
                <Col xs={10}>{selectedWork.code}</Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Row>
                <Col xs={2}><label>Sub Category</label></Col>
                <Col xs={10}>{selectedWork.sub_category.name}</Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Row>
                <Col xs={2}><label>Description</label></Col>
                <Col xs={10}>{selectedWork.description.name}</Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Row>
                <Col xs={2}><label>Interval</label></Col>
                <Col xs={10}>{selectedWork.interval.name}</Col>
              </Row>
            </Col>
            <Col xs={12}><Divider type="line"/></Col>
            <Col xs={12}>
              <Row>
                <Col xs={2}><label>Last Done (DD-MMM-YYYY)</label></Col>
                <Col xs={2}><label>Last Done (Run Hours)</label></Col>
                <Col xs={3}><label>Instructions</label></Col>
                <Col xs={2}><label>Encoded Date</label></Col>
                <Col xs={2}><label>Encoded By</label></Col>
                <Col xs={1}/>
              </Row>
            </Col>
            <Col xs={12}><Divider type="line"/></Col>
            {
              selectedWork.work_history.map((workHistory) => (
                <React.Fragment>
                  <Col xs={12}>
                    <Row>
                      <Col xs={2}>{workHistory.last_done}</Col>
                      <Col xs={2}>{workHistory.running_hours}</Col>
                      <Col xs={3}>{workHistory.instructions}</Col>
                      <Col xs={2}>{workHistory.created_at}</Col>
                      <Col xs={2}>{workHistory.creator}</Col>
                      <Col xs={1}>
                        {
                          workHistory.file
                            && !!profile.permissions['jobs_download_file']
                            && <Button type="primary" icon="fas-file"
                                       onClick={() => dispatch(fileDownloadAsync(workHistory.file))}/>
                        }
                      </Col>
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

export default WorkList;
