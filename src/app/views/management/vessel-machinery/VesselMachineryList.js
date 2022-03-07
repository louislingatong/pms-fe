import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {usePrevious} from '../../../utils/Hooks';
import {Col, Row} from 'react-bootstrap';
import {Box, Button, Content} from 'adminlte-2-react';
import DataTable from '../../../components/DataTable';
import {
  vesselMachineryData,
  vesselMachineryList,
  metaData,
  reqListStatus,
  vesselMachineryListAsync
} from '../../../store/vesselMachinerySlice';
import {activeVesselSubMenu} from '../../../store/navbarMenuSlice';
import VesselMachinery from '../../../core/models/VesselMachinery';
import Divider from '../../../components/Divider';
import VesselMachineryView from './VesselMachineryView';
import Modal from '../../../components/Modal';
import VesselDepartmentSelect from '../../../components/select/VesselDepartmentSelect';

function VesselMachineryList({name}) {
  const dispatch = useDispatch();

  const activeVessel = useSelector(activeVesselSubMenu);
  const vesselMachineries = useSelector(vesselMachineryList);
  const vesselMachinery = useSelector(vesselMachineryData);
  const meta = useSelector(metaData);
  const status = useSelector(reqListStatus);

  const isLoading = status === 'loading';

  const [localVesselMachinery, setLocalVesselMachinery] = useState(new VesselMachinery());
  const [localVesselMachineries, setLocalVesselMachineries] = useState(vesselMachineries);
  const [vesselMachineryModalShow, setVesselMachineryModalShow] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [params, setParams] = useState({vessel: activeVessel.name});
  const [filters, setFilters] = useState({});

  const prevLocalVesselMachinery = usePrevious(localVesselMachinery);
  const prevParams = usePrevious(params);
  const prevFilters = usePrevious(filters);

  useEffect(() => {
    if (activeVessel && activeVessel.id) {
      setFilters({});
    }
  }, []);

  useEffect(() => {
    if (activeVessel && activeVessel.id && !localVesselMachineries.length) {
      setParams({vessel: activeVessel.name});
    }
  }, [activeVessel]);

  useEffect(() => {
    if (localVesselMachineries) {
      setLocalVesselMachineries(vesselMachineries);
    }
  }, [vesselMachineries]);

  useEffect(() => {
    if (prevLocalVesselMachinery) {
      setLocalVesselMachinery(vesselMachinery);
      initList();
    }
  }, [vesselMachinery]);

  useEffect(() => {
    if (prevLocalVesselMachinery
      && (prevLocalVesselMachinery.id !== localVesselMachinery.id)
      && !!localVesselMachinery.id) {
      handleModalOpen();
    }
  }, [localVesselMachinery]);

  useEffect(() => {
    if (prevParams && prevFilters) {
      initList();
    }
  }, [params, filters]);

  const initList = () => {
    dispatch(vesselMachineryListAsync({...params, ...filters}));
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
      setLocalVesselMachinery(selectedRow);
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
    const {vessel, department} = params;
    if (keyword) {
      !!department
        ? setParams({vessel, department, keyword})
        : setParams({keyword});
    } else {
      !!department
        ? setParams({vessel, department})
        : setParams({});
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
    setVesselMachineryModalShow(true);
  };

  const handleModalClose = () => {
    setSelectedRowIds([]);
    setLocalVesselMachinery(new VesselMachinery());
    setVesselMachineryModalShow(false);
  };

  const header = [
    {
      title: 'Department',
      data: 'department',
      render: (department, row) => row.machinery.department.name,
    },
    {
      title: 'Machinery',
      data: 'machinery',
      render: machinery => machinery.name,
    },
    {
      title: 'Model',
      data: 'model',
      render: (model, row) => row.machinery.model.name,
    },
    {
      title: 'Maker',
      data: 'maker',
      render: (maker, row) => row.machinery.maker.name,
    },
    {
      title: 'In-charge',
      data: 'inchargeRank',
      render: (inchargeRank, row) => row.incharge_rank.name,
    },
  ];

  return (
    <React.Fragment>
      <Content title={name} browserTitle={name}>
        <Row>
          <Col xs={12}>
            <Button
              type="primary"
              text="Add New Vessel Machinery"
              onClick={handleModalOpen}
              pullRight
            />
          </Col>
          <Divider/>
          <Col xs={12}>
            <Box>
              <Row>
                <Col xs={12} md={4} lg={2}>
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
                    data={localVesselMachineries}
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
                    multiple
                    rowSelect
                    onSelect={handleRowSelect}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onPageLengthChange={handlePageLengthChange}
                    isLoading={isLoading}
                  />
                </Col>
                <Col xs={12}>
                  <Divider/>
                </Col>
                <Col xs={12}>
                  {
                    !!selectedRowIds.length
                    && <Button type="danger" text={`Delete (${selectedRowIds.length})`} pullRight/>
                  }
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
        <Modal
          show={vesselMachineryModalShow}
          title={localVesselMachinery.id ? 'Vessel Machinery Details' : 'Add New Vessel Machinery'}
          modalSize="lg"
          closeButton
          onHide={handleModalClose}
        >
          <VesselMachineryView data={localVesselMachinery}/>
        </Modal>
      </Content>
    </React.Fragment>
  )
}

export default VesselMachineryList;
