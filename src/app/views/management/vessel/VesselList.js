import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {usePrevious} from '../../../utils/Hooks';
import {Box, Button, Content} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import {
  reqListStatus,
  setVesselData,
  vesselData,
  vesselList,
  vesselMeta,
  vesselListAsync
} from '../../../store/vesselSlice';
import {profileData} from '../../../store/profileSlice';
import {DataTable, Divider, Modal} from '../../../components';
import Vessel from '../../../core/models/Vessel';
import VesselForm from '../form/VesselForm';

function VesselList({name}) {
  const history = useHistory();
  const dispatch = useDispatch();

  const vessel = useSelector(vesselData);
  const vessels = useSelector(vesselList);
  const metaData = useSelector(vesselMeta);
  const status = useSelector(reqListStatus);
  const profile = useSelector(profileData);

  const isLoading = status === 'loading';

  const [localVessel, setLocalVessel] = useState(new Vessel());
  const [localVessels, setLocalVessels] = useState(vessels);
  const [vesselModalShow, setVesselModalShow] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [params, setParams] = useState({});

  const prevLocalVessel = usePrevious(localVessel);
  const prevParams = usePrevious(params);

  useEffect(() => {
    initList();
  }, []);

  useEffect(() => {
    if (localVessels) {
      setLocalVessels(vessels);
    }
  }, [vessels]);


  useEffect(() => {
    if (prevLocalVessel) {
      setLocalVessel(vessel);
      handleModalClose();
      initList();
    }
  }, [vessel]);

  useEffect(() => {
    if (prevParams) {
      initList();
    }
  }, [params]);

  const initList = () => {
    dispatch(vesselListAsync(params));
  };

  const handleRowSelect = (selectedRow) => {
    if (!!profile.permissions['vessel_show']) {
      let newSelectedRowIds = selectedRowIds.slice();
      if (selectedRow.action === 'checked') {
        newSelectedRowIds.push(selectedRow.id);
      } else if (selectedRow.action === 'unchecked') {
        const i = newSelectedRowIds.indexOf(selectedRow);
        newSelectedRowIds.splice(i, 1);
      } else if (selectedRow.action === 'checked_all') {
        newSelectedRowIds = selectedRow.ids;
      } else if (selectedRow.action === 'unchecked_all') {
        newSelectedRowIds = [];
      } else {
        setLocalVessel(selectedRow);
        dispatch(setVesselData(selectedRow));
        history.push(`/vessels/${selectedRow.id}`);
      }
      setSelectedRowIds(newSelectedRowIds);
    }
  }

  const handlePageChange = (page) => {
    setParams({...params, page});
  };

  const handlePageLengthChange = (limit) => {
    setParams({...params, page: 1, limit});
  };

  const handleSearchChange = (keyword) => {
    if (keyword) {
      setParams({keyword});
    } else {
      setParams({});
    }
  };

  const handleModalOpen = () => {
    setVesselModalShow(true);
  };

  const handleModalClose = () => {
    setVesselModalShow(false);
  };

  const header = [
    {
      title: 'Owner',
      data: 'owner',
      render: owner => owner.name,
    },
    {
      title: 'Name',
      data: 'name',
    },
  ];

  return (
    <React.Fragment>
      <Content title={name} browserTitle={`ASTRO | Management - ${name}`}>
        <Row>
          <Col xs={12}>
            {
              !!profile.permissions['vessel_create']
                && <Button
                  type="primary"
                  text="Add New Vessel"
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
                    data={localVessels}
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
                    metaData={metaData}
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
                      && !!profile.permissions['vessel_delete']
                      && <Button type="danger" text={`Delete (${selectedRowIds.length})`} pullRight/>
                  }
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
        <Modal
          show={vesselModalShow}
          title="Add New Vessel"
          modalSize="lg"
          closeButton
          onHide={handleModalClose}
        >
          <VesselForm data={new Vessel()}/>
        </Modal>
      </Content>
    </React.Fragment>
  )
}

export default VesselList;
