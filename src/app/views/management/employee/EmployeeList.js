import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {usePrevious} from '../../../utils/Hooks';
import {Box, Button, Content} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import {
  employeeData,
  employeeList,
  metaData,
  reqListStatus,
  setEmployeeData,
  employeeListAsync,
} from '../../../store/employeeSlice';
import {DataTable, Divider, Modal} from '../../../components';
import Employee from '../../../core/models/Employee';
import EmployeeForm from '../form/EmployeeForm';

function EmployeeList({name}) {
  const history = useHistory();
  const dispatch = useDispatch();

  const employee = useSelector(employeeData);
  const employees = useSelector(employeeList);
  const meta = useSelector(metaData);
  const status = useSelector(reqListStatus);

  const isLoading = status === 'loading';

  const [localEmployee, setLocalEmployee] = useState(new Employee());
  const [localEmployees, setLocalEmployees] = useState(employees);
  const [employeeModalShow, setEmployeeModalShow] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [params, setParams] = useState({});

  const prevLocalVessel = usePrevious(localEmployee);
  const prevParams = usePrevious(params);

  useEffect(() => {
    initList();
  }, []);

  useEffect(() => {
    if (localEmployees) {
      setLocalEmployees(employees);
    }
  }, [employees]);

  useEffect(() => {
    if (prevLocalVessel) {
      setLocalEmployee(employee);
      handleModalClose();
      initList();
    }
  }, [employee]);

  useEffect(() => {
    if (prevParams) {
      initList();
    }
  }, [params]);

  const initList = () => {
    dispatch(employeeListAsync(params));
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
      setLocalEmployee(selectedRow);
      dispatch(setEmployeeData(selectedRow));
      history.push(`/employees/${selectedRow.id}`);
    }
    setSelectedRowIds(newSelectedRowIds);
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
    setEmployeeModalShow(true);
  };

  const handleModalClose = () => {
    setEmployeeModalShow(false);
  };

  const header = [
    {
      title: 'Employee ID',
      data: 'id_number',
    },
    {
      title: 'Name',
      data: 'full_name',
    },
    {
      title: 'Department',
      data: 'department',
      render: department => department.name,
    },
    {
      title: 'Position',
      data: 'position',
    },
  ];

  return (
    <React.Fragment>
      <Content title={name} browserTitle={name}>
        <Row>
          <Col xs={12}>
            <Button
              type="primary"
              text="Add New Employee"
              onClick={handleModalOpen}
              pullRight
            />
          </Col>
          <Divider/>
          <Col xs={12}>
            <Box>
              <Row>
                <Col xs={12}>
                  <DataTable
                    api
                    data={localEmployees}
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
          show={employeeModalShow}
          title="Add New Employee"
          modalSize="sm"
          closeButton
          onHide={handleModalClose}
        >
          <EmployeeForm data={new Employee()} />
        </Modal>
      </Content>
    </React.Fragment>
  )
}

export default EmployeeList;
