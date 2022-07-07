import UserStatus from './UserStatus';
import EmployeeDepartment from './EmployeeDepartment';

export default function User(data = {}) {
  this.id = data.id ? data.id : 0;
  this.first_name = data.first_name ? data.first_name : '';
  this.middle_name = data.middle_name ? data.middle_name : '';
  this.last_name = data.last_name ? data.last_name : '';
  this.full_name = data.full_name ? data.full_name : '';
  this.email = data.email ? data.email : '';
  this.status = data.status ? new UserStatus(data.status) : new UserStatus();
  this.department = data.department ? new EmployeeDepartment(data.department) : new EmployeeDepartment();
  this.id_number = data.id_number ? data.id_number : '';
  this.position = data.position ? data.position : '';
  this.is_admin = data.is_admin ? 1 : 0;
  this.permissions = data.permissions ? data.permissions : {};
}
