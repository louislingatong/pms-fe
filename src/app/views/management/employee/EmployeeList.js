import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {usePrevious} from '../../../utils/Hooks';
import {Box, Button, Content} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import {
  employeeActivateAsync,
  employeeData, employeeDeactivateAsync,
  employeeList,
  employeeListAsync,
  employeeMeta,
  reqListStatus,
  setEmployeeData, setEmployeeStatus, statusChanged,
} from '../../../store/employeeSlice';
import {profileData} from '../../../store/profileSlice';
import {DataTable, Divider, Modal} from '../../../components';
import Employee from '../../../core/models/Employee';
import EmployeeForm from '../form/EmployeeForm';

function EmployeeList({name}) {
  const history = useHistory();
  const dispatch = useDispatch();

  const employee = useSelector(employeeData);
  const employees = useSelector(employeeList);
  const metaData = useSelector(employeeMeta);
  const status = useSelector(reqListStatus);
  const profile = useSelector(profileData);
  const isStatusChanged = useSelector(statusChanged)

  const isLoading = status === 'loading';

  const [localEmployee, setLocalEmployee] = useState(new Employee());
  const [localEmployees, setLocalEmployees] = useState(employees);
  const [employeeModalShow, setEmployeeModalShow] = useState(false);
  const [selectedActivatedIds, setSelectedActivatedRowIds] = useState([]);
  const [selectedDeactivatedIds, setSelectedDeactivatedRowIds] = useState([]);
  const [params, setParams] = useState({});

  const prevLocalEmployee = usePrevious(localEmployee);
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
    if (prevLocalEmployee) {
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

  useEffect(() => {
    if (isStatusChanged) {
      initList();
      setSelectedDeactivatedRowIds([]);
      setSelectedActivatedRowIds([]);
      dispatch(setEmployeeStatus(false));
    }
  }, [isStatusChanged]);

  const initList = () => {
    dispatch(employeeListAsync(params));
  };

  const handleRowSelect = (selectedRow) => {
    let newSelectedActivatedRowIds = selectedActivatedIds.slice();
    let newSelectedDeactivatedRowIds = selectedDeactivatedIds.slice();
    if (selectedRow.action === 'checked') {
      if (isActivated(selectedRow.id)) {
        newSelectedActivatedRowIds.push(selectedRow.id);
      } else {
        newSelectedDeactivatedRowIds.push(selectedRow.id);
      }
      setSelectedActivatedRowIds(newSelectedActivatedRowIds);
      setSelectedDeactivatedRowIds(newSelectedDeactivatedRowIds);
    } else if (selectedRow.action === 'unchecked') {
      if (isActivated(selectedRow.id)) {
        const i = newSelectedActivatedRowIds.indexOf(selectedRow.id);
        newSelectedActivatedRowIds.splice(i, 1);
      } else {
        const i = newSelectedDeactivatedRowIds.indexOf(selectedRow.id);
        newSelectedDeactivatedRowIds.splice(i, 1);
      }
      setSelectedActivatedRowIds(newSelectedActivatedRowIds);
      setSelectedDeactivatedRowIds(newSelectedDeactivatedRowIds);
    } else if (selectedRow.action === 'checked_all') {
      selectedRow.ids.forEach((id) => {
        if (isActivated(id)) {
          newSelectedActivatedRowIds.push(id);
        } else {
          newSelectedDeactivatedRowIds.push(id);
        }
      });
      setSelectedActivatedRowIds(newSelectedActivatedRowIds);
      setSelectedDeactivatedRowIds(newSelectedDeactivatedRowIds);
    } else if (selectedRow.action === 'unchecked_all') {
      setSelectedActivatedRowIds([]);
      setSelectedDeactivatedRowIds([]);
    } else {
      if (!!profile.permissions['employee_show']) {
        setLocalEmployee(selectedRow);
        dispatch(setEmployeeData(selectedRow));
        history.push(`/employees/${selectedRow.id}`);
      }
    }
  };

  const isActivated = (id) => {
    const emp = localEmployees.find(employee => employee.id === id);
    return emp.status.name.toLowerCase() === 'active'
  };

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

  const handleActivate = () => {
    const data = {};
    selectedDeactivatedIds.forEach((id, i) => {
      data[`employee_ids[${i}]`] = id;
    });
    dispatch(employeeActivateAsync(data));
  }

  const handleDeactivate = () => {
    const data = {};
    selectedActivatedIds.forEach((id, i) => {
      data[`employee_ids[${i}]`] = id;
    });
    dispatch(employeeDeactivateAsync(data));
  }

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
    {
      title: 'Status',
      data: 'status',
      render: status => status.name,
    },
  ];

  return (
    <React.Fragment>
      <Content title={name} browserTitle={`ASTRO | Management - ${name}`}>
        <Row>
          <Col xs={12}>
            {
              !!profile.permissions['employee_create']
                && <Button
                  type="primary"
                  text="Add New Employee"
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
                    data={localEmployees}
                    columns={header}
                    selectedRowIds={selectedActivatedIds.concat(selectedDeactivatedIds)}
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
                    !!selectedActivatedIds.length
                    && !!profile.permissions['employee_delete']
                    && <Button type="danger"
                               text={`Deactivate (${selectedActivatedIds.length})`}
                               pullRight
                               onClick={handleDeactivate}
                               disabled={isLoading}/>
                  }
                  {
                    !!selectedDeactivatedIds.length
                    && !!profile.permissions['employee_delete']
                    && <Button type="primary"
                               text={`Activate (${selectedDeactivatedIds.length})`}
                               pullRight
                               onClick={handleActivate}
                               disabled={isLoading}/>
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
          <EmployeeForm data={new Employee()}/>
        </Modal>
      </Content>
    </React.Fragment>
  )
}

export default EmployeeList;
