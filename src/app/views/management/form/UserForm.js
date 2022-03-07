import React, {useState} from 'react';
import classnames from 'classnames';

function UserForm() {
  const [active, setActive] = useState('personal');
  return (
    <React.Fragment>
      <ul className="nav nav-pills">
        <li className="nav-item">
          <a href="#" role="button" className={classnames(`nav-link`, classnames({'active': active === 'personal'}))}
             data-toggle="tab" onClick={() => setActive('personal')}>Personal Info</a>
        </li>
        <li className="nav-item">
          <a href="#" role="button" className={classnames(`nav-link`, classnames({'active': active === 'employment'}))}
             data-toggle="tab" onClick={() => setActive('employment')}>Employment Info</a>
        </li>
        <li className="nav-item">
          <a href="#" role="button" className={classnames(`nav-link`, classnames({'active': active === 'account'}))}
             data-toggle="tab" onClick={() => setActive('account')}>Account Info</a>
        </li>
      </ul>
      <div className="tab-content mt-3">
        <div className={classnames(`tab-pane`, classnames({'active': active === 'personal'}))}>
          <div className="form-group row">
            <label htmlFor="inputFirstName" className="col-sm-3 col-form-label">First Name</label>
            <div className="col-sm-9">
              <input className="form-control" id="inputFirstName" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputMiddleName" className="col-sm-3 col-form-label">Middle Name</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="inputMiddleName" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputLastName" className="col-sm-3 col-form-label">Last Name</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="inputLastName" />
            </div>
          </div>
        </div>
        <div className={classnames(`tab-pane`, classnames({'active': active === 'employment'}))}>
          <div className="form-group row">
            <label htmlFor="inputEmployeeId" className="col-sm-3 col-form-label">Employee ID</label>
            <div className="col-sm-9">
              <input className="form-control" id="inputEmployeeId" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputDepartment" className="col-sm-3 col-form-label">Department</label>
            <div className="col-sm-9">
              <select id="inputDepartment" className="form-control select2">
                <option hidden>Select a Department</option>
                <option>Admin/HR</option>
                <option>Accounting</option>
                <option>I.T</option>
                <option>Technical</option>
                <option>Marine</option>
                <option>Crewing</option>
                <option>Purchasing</option>
                <option>Top Management</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputPosition" className="col-sm-3 col-form-label">Position</label>
            <div className="col-sm-9">
              <input className="form-control" id="inputPosition" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputSection" className="col-sm-3 col-form-label">Section</label>
            <div className="col-sm-9">
              <input className="form-control" id="inputSection" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputUserType" className="col-sm-3 col-form-label">Usertype</label>
            <div className="col-sm-9">
              <select id="inputUserType" className="form-control select2">
                <option hidden>Select a User Type</option>
                <option>Administrator</option>
                <option>Guest</option>
                <option>User</option>
              </select>
            </div>
          </div>
        </div>
        <div className={classnames(`tab-pane`, classnames({'active': active === 'account'}))}>
          <div className="form-group row">
            <label htmlFor="inputUsername" className="col-sm-3 col-form-label">Username</label>
            <div className="col-sm-9">
              <input className="form-control" id="inputUsername" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputPassword" className="col-sm-3 col-form-label">Password</label>
            <div className="col-sm-9">
              <input type="password" className="form-control" id="inputPassword" />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default UserForm;