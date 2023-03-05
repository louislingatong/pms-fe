import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {usePrevious} from '../../../utils/Hooks';
import {Col, Row} from 'react-bootstrap';
import {Box, Button, Content} from 'adminlte-2-react';
import DataTable from '../../../components/DataTable';
import Modal from '../../../components/Modal';
import Divider from '../../../components/Divider';
import {
  machineriesDeleteAsync,
  machineriesDeleted,
  machineryData,
  machineryList,
  machineryListAsync,
  machineryMeta,
  reqListStatus,
  setDeletedStatus
} from '../../../store/machinerySlice';
import {profileData} from '../../../store/profileSlice';
import MachineryView from './MachineryView';
import Machinery from '../../../core/models/Machinery';
import VesselDepartmentSelect from '../../../components/select/VesselDepartmentSelect';

function MachineryList({name}) {
  const dispatch = useDispatch();

  const machineries = useSelector(machineryList);
  const machinery = useSelector(machineryData);
  const metaData = useSelector(machineryMeta);
  const status = useSelector(reqListStatus);
  const profile = useSelector(profileData);
  const isDeleted = useSelector(machineriesDeleted);

  const isLoading = status === 'loading';

  const [localMachinery, setLocalMachinery] = useState(new Machinery());
  const [localMachineries, setLocalMachineries] = useState(machineries);
  const [machineryModalShow, setMachineryModalShow] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [params, setParams] = useState({});
  const [filters, setFilters] = useState({});

  const prevLocalMachinery = usePrevious(localMachinery);
  const prevParams = usePrevious(params);
  const prevFilters = usePrevious(filters);

  useEffect(() => {
    initList();
  }, []);

  useEffect(() => {
    if (localMachineries) {
      setLocalMachineries(machineries);
    }
  }, [machineries]);

  useEffect(() => {
    if (prevLocalMachinery) {
      setLocalMachinery(machinery);
      initList();
    }
  }, [machinery]);

  useEffect(() => {
    if (prevLocalMachinery
      && (prevLocalMachinery.id !== localMachinery.id)
      && !!localMachinery.id) {
      handleModalOpen();
    }
  }, [localMachinery]);

  useEffect(() => {
    if (prevParams && prevFilters) {
      initList();
    }
  }, [params, filters]);

  useEffect(() => {
    if (isDeleted) {
      initList();
      dispatch(setDeletedStatus(false));
      setSelectedRowIds([]);
    }
  }, [isDeleted]);

  const initList = () => {
    dispatch(machineryListAsync({...params, ...filters}));
  };

  const handleRowSelect = (selectedRow) => {
    let newSelectedRowIds = selectedRowIds.slice();
    if (selectedRow.action === 'checked') {
      newSelectedRowIds.push(selectedRow.id);
      setSelectedRowIds(newSelectedRowIds);
    } else if (selectedRow.action === 'unchecked') {
      const i = newSelectedRowIds.indexOf(selectedRow);
      newSelectedRowIds.splice(i, 1);
      setSelectedRowIds(newSelectedRowIds);
    } else if (selectedRow.action === 'checked_all') {
      setSelectedRowIds(selectedRow.ids);
    } else if (selectedRow.action === 'unchecked_all') {
      setSelectedRowIds([]);
    } else {
      if (!!profile.permissions['machinery_show']) {
        setLocalMachinery(selectedRow);
      }
    }
  };

  const handlePageChange = (page) => {
    setParams({...params, page});
  };

  const handlePageLengthChange = (limit) => {
    setParams({...params, page: 1, limit});
  };

  const handleSearchChange = (keyword) => {
    const {department} = params;
    if (keyword) {
      !!department ? setParams({department, keyword}) : setParams({keyword});
    } else {
      !!department ? setParams({department}) : setParams({});
    }
  };

  const handleFilterChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFilters(prevState => {
      const newState = {...prevState};
      !!value ? newState[name] = value : delete newState[name];
      return newState;
    });
  };

  const handleModalOpen = () => {
    setMachineryModalShow(true);
  };

  const handleModalClose = () => {
    setSelectedRowIds([]);
    setLocalMachinery(new Machinery());
    setMachineryModalShow(false);
  };

  const handleDelete = () => {
    const data = {};
    selectedRowIds.forEach((id, i) => {
      data[`machinery_ids[${i}]`] = id;
    });
    dispatch(machineriesDeleteAsync(data));
  };

  const header = [
    {
      title: 'Department',
      data: 'department',
      render: department => department.name,
      width: 20,
    },
    {
      title: 'Name',
      data: 'name',
      width: 50,
    },
    {
      title: 'Code',
      data: 'code_name',
    },
  ];

  return (
    <React.Fragment>
      <Content title={name} browserTitle={`ASTRO | Management - ${name}`}>
        <Row>
          <Col xs={12}>
            {
              !!profile.permissions['machinery_create']
                && <Button
                  type="primary"
                  text="Add New Machinery"
                  onClick={handleModalOpen}
                  pullRight/>
            }
          </Col>
          <Divider/>
          <Col xs={12}>
            <Box>
              <Row>
                <Col xs={12}>
                  <DataTable
                    api
                    data={localMachineries}
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
                    meta={metaData}
                    multiple
                    rowSelect
                    onSelect={handleRowSelect}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onPageLengthChange={handlePageLengthChange}
                    isLoading={isLoading}
                    filters={
                      <Col xs={12} sm={4} md={3} lg={2}>
                        <VesselDepartmentSelect
                          name="department"
                          id="departmentFilterSelect"
                          placeholder="Department"
                          allowClear={true}
                          onChange={handleFilterChange}
                        />
                      </Col>
                    }
                  />
                </Col>
                <Col xs={12}>
                  <Divider/>
                </Col>
                <Col xs={12}>
                  {
                    !!selectedRowIds.length
                      && !!profile.permissions['machinery_delete']
                      && <Button type="danger"
                                 text={`Delete (${selectedRowIds.length})`}
                                 onClick={handleDelete}
                                 pullRight
                                 disabled={isLoading}/>
                  }
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
        <Modal
          show={machineryModalShow}
          title={localMachinery.id ? 'Machinery Details' : 'Add New Machinery'}
          modalSize="lg"
          closeButton
          onHide={handleModalClose}
        >
          <MachineryView data={localMachinery}/>
        </Modal>
      </Content>
    </React.Fragment>
  )
}

export default MachineryList;
