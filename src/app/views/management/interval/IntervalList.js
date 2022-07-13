import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {usePrevious} from '../../../utils/Hooks';
import {Box, Button, Content} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import {
  intervalData,
  intervalList,
  intervalMeta,
  intervalListAsync,
  reqListStatus,
  intervalsDeleted,
  setDeletedStatus, intervalsDeleteAsync
} from '../../../store/intervalSlice';
import {profileData} from '../../../store/profileSlice';
import {DataTable, Divider, Modal} from '../../../components';
import Interval from '../../../core/models/Interval';
import IntervalView from './IntervalView';

function IntervalList({name}) {
  const dispatch = useDispatch();

  const interval = useSelector(intervalData);
  const intervals = useSelector(intervalList);
  const metaData = useSelector(intervalMeta);
  const status = useSelector(reqListStatus);
  const profile = useSelector(profileData);
  const isDeleted = useSelector(intervalsDeleted);

  const isLoading = status === 'loading';

  const [localInterval, setLocalInterval] = useState(new Interval());
  const [localIntervals, setLocalIntervals] = useState(intervals);
  const [intervalModalShow, setIntervalModalShow] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [params, setParams] = useState({});

  const prevLocalInterval = usePrevious(localInterval);
  const prevParams = usePrevious(params);

  useEffect(() => {
    initList();
  }, []);

  useEffect(() => {
    if (localIntervals) {
      setLocalIntervals(intervals);
    }
  }, [intervals]);

  useEffect(() => {
    if (prevLocalInterval) {
      setLocalInterval(interval);
      handleModalClose();
      initList();
    }
  }, [interval]);

  useEffect(() => {
    if (prevLocalInterval
      && (prevLocalInterval.id !== localInterval.id)
      && !!localInterval.id) {
      handleModalOpen();
    }
  }, [localInterval]);

  useEffect(() => {
    if (prevParams) {
      initList();
    }
  }, [params]);

  useEffect(() => {
    if (isDeleted) {
      initList();
      dispatch(setDeletedStatus(false));
      setSelectedRowIds([]);
    }
  }, [isDeleted]);

  const initList = () => {
    dispatch(intervalListAsync(params));
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
      if (!!profile.permissions['interval_show']) {
        setLocalInterval(selectedRow);
      }
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
    setIntervalModalShow(true);
  };

  const handleModalClose = () => {
    setSelectedRowIds([]);
    setLocalInterval(new Interval());
    setIntervalModalShow(false);
  };

  const handleDelete = () => {
    const data = {};
    selectedRowIds.forEach((id, i) => {
      data[`interval_ids[${i}]`] = id;
    });
    dispatch(intervalsDeleteAsync(data));
  };

  const header = [
    {
      title: 'Interval',
      data: 'name',
    },
  ];

  return (
    <React.Fragment>
      <Content title={name} browserTitle={`ASTRO | Management - ${name}`}>
        <Row>
          <Col xs={12}>
            {
              !!profile.permissions['interval_create']
                && <Button
                  type="primary"
                  text="Add New Interval"
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
                    data={localIntervals}
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
                  />
                </Col>
                <Col xs={12}>
                  <Divider/>
                </Col>
                <Col xs={12}>
                  {
                    !!selectedRowIds.length
                      && !!profile.permissions['interval_delete']
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
          show={intervalModalShow}
          title={localInterval.id ? 'Interval Details' : 'Add New Interval'}
          modalSize="sm"
          closeButton
          onHide={handleModalClose}
        >
          <IntervalView data={localInterval}/>
        </Modal>
      </Content>
    </React.Fragment>
  )
}

export default IntervalList;
