import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Content, Inputs} from 'adminlte-2-react';
import {Col, Row} from 'react-bootstrap';
import {employeeData, employeeDataAsync,} from '../../../store/employeeSlice';
import {Modal} from '../../../components';
import EmployeeForm from '../form/EmployeeForm';

const placeholderPassword = 'E5DywsaXsMmlzqstXBScQ9YnLJOI4X55OlQbWM2d';

function EmployeeView({match, name}) {
  const {Text} = Inputs;

  const history = useHistory();
  const dispatch = useDispatch();
  const employee = useSelector(employeeData);

  const { params } = match;
  const paramId = parseInt(params.id);

  const [localEmployee, setLocalEmployee] = useState(employee);
  const [vesselModalShow, setVesselModalShow] = useState(false);

  useEffect(() => {
    if (employee.id) {
      setLocalEmployee(employee);
      handleModalClose();
    }
    if (!employee.id) {
      initData();
    }
  }, [employee]);

  const initData = () => {
    dispatch(employeeDataAsync(paramId));
  };

  const handleModalOpen = () => {
    setVesselModalShow(true);
  };

  const handleModalClose = () => {
    setVesselModalShow(false);
  };

  return (
    <Content title={name} browserTitle={name}>
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
            </ul>
            <div className="tab-content">
              <div className="tab-pane active" id="employeeInfo">
                <Row>
                  <Col xs={6}>
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
                    </Row>
                  </Col>
                  <Col xs={6}>
                    <Row>
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
                </Row>
              </div>
              <div className="tab-pane" id="accountInfo">
                <Row>
                  <Col xs={6}>
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
            </div>
          </div>
        </Col>
        <Col xs={12}>
          <Button type="default" text="Back" onClick={() => history.goBack()}/>
          <Button type="primary" text="Edit" onClick={handleModalOpen} pullRight/>
        </Col>
      </Row>
      <Modal
        show={vesselModalShow}
        title="Edit Employee"
        modalSize="sm"
        closeButton
        onHide={handleModalClose}
      >
        <EmployeeForm data={localEmployee} />
      </Modal>
    </Content>
  )
}

export default EmployeeView;
