import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Content, Inputs} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import {
  employeeData,
  employeeDataAsync,
  employeePermissionEditAsync,
  reqDataStatus
} from '../../../store/employeeSlice';
import {profileData} from '../../../store/profileSlice';
import {permissionList, permissionListAsync} from '../../../store/permissionSlice';
import {Modal} from '../../../components';
import EmployeeForm from '../form/EmployeeForm';

const placeholderPassword = 'E5DywsaXsMmlzqstXBScQ9YnLJOI4X55OlQbWM2d';

function EmployeeView({match, name}) {
  const {Text} = Inputs;

  const history = useHistory();
  const dispatch = useDispatch();

  const employee = useSelector(employeeData);
  const status = useSelector(reqDataStatus);
  const profile = useSelector(profileData);
  const allPermissions = useSelector(permissionList);

  const {params} = match;
  const paramId = parseInt(params.id);

  const [localEmployee, setLocalEmployee] = useState(employee);
  const [vesselModalShow, setVesselModalShow] = useState(false);
  const [localAllPermissions, setLocalAllPermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const isLoading = status === 'loading';

  useEffect(() => {
    dispatch(employeeDataAsync(paramId));
    dispatch(permissionListAsync());
  }, []);

  useEffect(() => {
    if (employee.id) {
      setLocalEmployee(employee);
      setPermissions(Object.keys(employee.permissions));
      handleModalClose();
    }
  }, [employee]);

  useEffect(() => {
    if (allPermissions.length) {
      setLocalAllPermissions(allPermissions);
    }
  }, [allPermissions]);

  const handleModalOpen = () => {
    setVesselModalShow(true);
  };

  const handleModalClose = () => {
    setVesselModalShow(false);
  };

  const handlePermissionChange = (e, permission) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setPermissions(prevState => {
        const state = prevState.slice();
        state.push(permission);
        return state;
      })
    } else {
      const index = permissions.indexOf(permission);
      setPermissions(prevState => {
        const state = prevState.slice();
        state.splice(index, 1);
        return state;
      })
    }
  };

  const handleSavePermissions = () => {
    const permissionData = {employee_id: employee.id};
    permissions.forEach((name, i) => {
      permissionData[`permissions[${i}]`] = name;
    });
    dispatch(employeePermissionEditAsync(permissionData));
  };

  return (
    <Content title={name} browserTitle={`ASTRO | Management - ${name}`}>
      <Row>
        <Col xs={12}>
          <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
              <li className="active">
                <a href="#employeeInfo" data-toggle="tab" aria-expanded="false">Employee Information</a>
              </li>
              <li className="">
                <a href="#accountInfo" data-toggle="tab" aria-expanded="false">Account Information</a>
              </li>
              <li className="">
                <a href="#accessControlList" data-toggle="tab" aria-expanded="false">Access Control List</a>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane active" id="employeeInfo">
                <Row>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={12}>
                        <Row>
                          <Col xs={4}><label>First Name</label></Col>
                          <Col xs={8}>
                            <Text name="first_name"
                                  id="firstNameInput"
                                  labelPosition="none"
                                  value={localEmployee.first_name}
                                  disabled
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row>
                          <Col xs={4}><label>Middle Name</label></Col>
                          <Col xs={8}>
                            <Text name="middle_name"
                                  id="middleNameInput"
                                  labelPosition="none"
                                  value={localEmployee.middle_name}
                                  disabled
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row>
                          <Col xs={4}><label>Last Name</label></Col>
                          <Col xs={8}>
                            <Text name="last_name"
                                  id="lastNameInput"
                                  labelPosition="none"
                                  value={localEmployee.last_name}
                                  disabled
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row>
                          <Col xs={4}><label>Is Admin</label></Col>
                          <Col xs={8}>
                            <input type="checkbox" name="is_admin"
                                   checked={!!localEmployee.is_admin}
                                   disabled
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={12}>
                        <Row>
                          <Col xs={4}><label>Department</label></Col>
                          <Col xs={8}>
                            <Text name="department"
                                  id="departmentInput"
                                  labelPosition="none"
                                  value={employee.department.name}
                                  disabled
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row>
                          <Col xs={4}><label>Employee ID</label></Col>
                          <Col xs={8}>
                            <Text name="id_number"
                                  id="idNumberInput"
                                  labelPosition="none"
                                  value={employee.id_number}
                                  disabled
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row>
                          <Col xs={4}><label>Position</label></Col>
                          <Col xs={8}>
                            <Text name="position"
                                  id="positionInput"
                                  labelPosition="none"
                                  value={localEmployee.position}
                                  disabled
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    {
                      !!profile.permissions['employee_edit']
                      && <Button type="primary" text="Edit" onClick={handleModalOpen} pullRight/>
                    }
                  </Col>
                </Row>
              </div>
              <div className="tab-pane" id="accountInfo">
                <Row>
                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={12}>
                        <Row>
                          <Col xs={4}><label>Email</label></Col>
                          <Col xs={8}>
                            <Text name="email"
                                  id="emailInput"
                                  labelPosition="none"
                                  value={employee.email}
                                  disabled
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row>
                          <Col xs={4}><label>Password</label></Col>
                          <Col xs={8}>
                            <Text inputType="password"
                                  name="password"
                                  id="passwordInput"
                                  labelPosition="none"
                                  value={placeholderPassword}
                                  disabled
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="tab-pane" id="accessControlList">
                <Row>
                  {
                    localAllPermissions.map(permission => (
                      <Col key={permission.name} xs={12} sm={6} md={4} lg={3}>
                        <div className="checkbox">
                          <label>
                            <input type="checkbox" name="is_admin"
                                   checked={permissions.includes(permission.name)}
                                   onChange={(e) => handlePermissionChange(e, permission.name)}/>
                            { permission.name.replaceAll('_', ' ') }
                          </label>
                        </div>
                      </Col>
                    ))
                  }
                  <Col xs={12}>
                    {
                      !!profile.permissions['employee_edit']
                        && <Button type="primary"
                                   text="Save"
                                   onClick={handleSavePermissions}
                                   disabled={isLoading}
                                   pullRight/>
                    }
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12}>
          <Button type="default" text="Back" onClick={() => history.goBack()}/>
        </Col>
      </Row>
      <Modal
        show={vesselModalShow}
        title="Edit Employee"
        modalSize="sm"
        closeButton
        onHide={handleModalClose}
      >
        <EmployeeForm data={localEmployee}/>
      </Modal>
    </Content>
  )
}

export default EmployeeView;
