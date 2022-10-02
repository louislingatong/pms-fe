import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {usePrevious} from '../../../utils/Hooks';
import {Col, Row} from 'react-bootstrap';
import {Box, Button, Content} from 'adminlte-2-react';
import DataTable from '../../../components/DataTable';
import {
  vesselMachineryData,
  vesselMachineryList,
  vesselMachineryMeta,
  vesselMachineryListAsync,
  reqListStatus,
  vesselMachineriesDeleted,
  setDeletedStatus,
  vesselMachineriesDeleteAsync,
  vesselMachineryExportAllAsync,
  vesselList,
  vesselMeta,
  reqVesselListStatus,
  vesselListAsync,
  vesselMachineryCopyAsync,
  reqCopyStatus
} from '../../../store/vesselMachinerySlice';
import {profileData} from '../../../store/profileSlice';
import {activeVessel as defaultActiveVessel} from '../../../store/navbarMenuSlice';
import VesselMachinery from '../../../core/models/VesselMachinery';
import Divider from '../../../components/Divider';
import VesselMachineryView from './VesselMachineryView';
import Modal from '../../../components/Modal';
import VesselDepartmentSelect from '../../../components/select/VesselDepartmentSelect';
import {PulseLoader} from 'react-spinners';

const queryLimit = 20;

function VesselMachineryList({name}) {
  const dispatch = useDispatch();

  const activeVessel = useSelector(defaultActiveVessel);
  const vesselMachinery = useSelector(vesselMachineryData);
  const vesselMachineries = useSelector(vesselMachineryList);
  const metaData = useSelector(vesselMachineryMeta);
  const status = useSelector(reqListStatus);
  const profile = useSelector(profileData);
  const isDeleted = useSelector(vesselMachineriesDeleted);
  const allVessels = useSelector(vesselList);
  const vesselMetaData = useSelector(vesselMeta);
  const vesselListStatus = useSelector(reqVesselListStatus);
  const copyStatus = useSelector(reqCopyStatus);

  const isLoading = status === 'loading';
  const isFetchingVessels = vesselListStatus === 'loading';
  const isCopyingVesselMachinery = copyStatus === 'loading';

  const [localVesselMachinery, setLocalVesselMachinery] = useState(new VesselMachinery());
  const [localVesselMachineries, setLocalVesselMachineries] = useState(vesselMachineries);
  const [vesselMachineryModalShow, setVesselMachineryModalShow] = useState(false);
  const [vesselSelectionModalShow, setVesselSelectionModalShow] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [params, setParams] = useState({vessel: activeVessel.name});
  const [filters, setFilters] = useState({});
  const [localAllVessels, setLocalAllVessels] = useState([]);
  const [vesselToCopy, setVesselToCopy] = useState('');

  const prevLocalVesselMachinery = usePrevious(localVesselMachinery);
  const prevParams = usePrevious(params);
  const prevFilters = usePrevious(filters);

  useEffect(() => {
    if (activeVessel && activeVessel.id) {
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
      if (!prevLocalVesselMachinery.id) {
        initList();
      }
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

  useEffect(() => {
    if (isDeleted) {
      initList();
      dispatch(setDeletedStatus(false));
      setSelectedRowIds([]);
    }
  }, [isDeleted]);

  useEffect(() => {
    if (allVessels.length) {
      setLocalAllVessels(allVessels);
    }
  }, [allVessels]);

  const initList = () => {
    dispatch(vesselMachineryListAsync({...params, ...filters}));
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
      if (!!profile.permissions['vessel_machinery_show']) {
        setLocalVesselMachinery(selectedRow);
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
    const {vessel, department} = params;
    if (keyword) {
      !!department
        ? setParams({vessel, department, keyword})
        : setParams({vessel, keyword});
    } else {
      !!department
        ? setParams({vessel, department})
        : setParams({vessel});
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

  const handleVesselSelectionModalOpen = () => {
    setVesselSelectionModalShow(true);
    dispatch(vesselListAsync({limit: queryLimit}));
  };

  const handleModalClose = () => {
    setSelectedRowIds([]);
    setLocalVesselMachinery(new VesselMachinery());
    setVesselMachineryModalShow(false);
  };

  const handleVesselSelectionModalClose = () => {
    setVesselSelectionModalShow(false);
  }

  const handleDelete = () => {
    const data = {};
    selectedRowIds.forEach((id, i) => {
      data[`vessel_machinery_ids[${i}]`] = id;
    });
    dispatch(vesselMachineriesDeleteAsync(data));
  };

  const handleExportAllVesselMachinery = () => {
    dispatch(vesselMachineryExportAllAsync({...params}));
  };

  const handleVesselChange = (vessel) => {
    setVesselToCopy(vessel);
  };

  const handleLoadMoreVessels = () => {
    dispatch(vesselListAsync({limit: vesselMetaData.per_page + queryLimit}));
  };

  const handleCopyMachinery = () => {
    dispatch(vesselMachineryCopyAsync({
      vesselFrom: vesselToCopy,
      vesselTo: activeVessel.name
    }))
      .then(({payload}) => {
        if (payload) {
          handleVesselSelectionModalClose();
          initList();
        }
      });
  }

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
      render: model => model.name,
    },
    {
      title: 'Maker',
      data: 'maker',
      render: maker => maker.name,
    },
    {
      title: 'In-charge',
      data: 'incharge_rank',
      render: inchargeRank => inchargeRank.name,
    },
  ];

  return (
    <React.Fragment>
      <Content title={name} browserTitle={`ASTRO | PMS - ${name}`}>
        <Row>
          <Col xs={12}>
            {
              !!profile.permissions['vessel_machinery_create']
                && <React.Fragment>
                    <Button
                        type="primary"
                        text="Add New Vessel Machinery"
                        onClick={handleModalOpen}
                        pullRight/>
                    <Button
                        type="default"
                        text="Copy Vessel Machinery"
                        className="margin-r-5"
                        onClick={handleVesselSelectionModalOpen}
                        pullRight/>
                </React.Fragment>
            }
          </Col>
          <Divider/>
          <Col xs={12}>
            <Box>
              <Row>
                <Col xs={12}>
                  <Row>
                    <Col xs={12} md={5} lg={3}>
                      <VesselDepartmentSelect
                        name="department"
                        id="departmentFilterSelect"
                        placeholder="Department"
                        allowClear={true}
                        onChange={handleFilterChange}
                      />
                    </Col>
                    <Col xs={12} md={7} lg={9}>
                      {
                        !!profile.permissions['vessel_machinery_export']
                        && <Button
                          type="primary"
                          text="Export"
                          onClick={handleExportAllVesselMachinery}
                          pullRight
                        />
                      }
                    </Col>
                  </Row>
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
                    meta={metaData}
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
                      && !!profile.permissions['vessel_machinery_delete']
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
          show={vesselMachineryModalShow}
          title={localVesselMachinery.id ? 'Vessel Machinery Details' : 'Add New Vessel Machinery'}
          modalSize="lg"
          closeButton
          onHide={handleModalClose}
        >
          <VesselMachineryView data={localVesselMachinery}/>
        </Modal>
        <Modal
          show={vesselSelectionModalShow}
          title="Copy Vessel Machinery"
          modalSize="sm"
          closeButton
          onHide={handleVesselSelectionModalClose}
        >
          <Row>
            <Col xs={12}>
              {
                isFetchingVessels
                  ? <div className="text-center"><strong>Loading</strong><PulseLoader size={3}/></div>
                  : <React.Fragment>
                    <div className="form-group">
                      {
                        localAllVessels.map(vessel => {
                          if (vessel.id !== activeVessel.id) {
                            return (
                              <div key={vessel.name} className="radio">
                                <label>
                                  <input type="radio" name="optionsVessels"
                                         onChange={(e) => handleVesselChange(vessel.name)}/>
                                  {vessel.name}
                                </label>
                              </div>
                            )
                          }
                        })
                      }
                    </div>
                    {
                      (vesselMetaData.last_page !== vesselMetaData.current_page)
                      && (
                        <div className="text-center">
                          <a href="javascript:" onClick={handleLoadMoreVessels}>Load More Vessels</a>
                        </div>
                      )
                    }
                    {
                      vesselToCopy &&
                      <Col xs={12} className="text-center">
                        <Button
                          type="primary"
                          text={
                            isCopyingVesselMachinery
                              ? <React.Fragment><strong>Copying</strong><PulseLoader size={3} color="fff"/></React.Fragment>
                              : `Copy All Machinery of ${vesselToCopy}`}
                          onClick={handleCopyMachinery}
                          disabled={isCopyingVesselMachinery}/>
                      </Col>
                    }
                  </React.Fragment>
              }
            </Col>
          </Row>
        </Modal>
      </Content>
    </React.Fragment>
  )
}

export default VesselMachineryList;
