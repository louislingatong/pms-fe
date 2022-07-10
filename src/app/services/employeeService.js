import Http from '../utils/Http';

export function fetchAll(params) {
  return new Promise((resolve, reject) => {
    Http.get('employees', {params})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      })
  })
}

export function fetchById(id) {
  return new Promise((resolve, reject) => {
    Http.get(`employees/${id}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      })
  })
}

export function add(data) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  formData.append('_method', 'POST');
  return new Promise((resolve, reject) => {
    Http.post('employees', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

export function edit(data) {
  let employeeId;
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key === 'employee_id') {
      employeeId = value;
    } else {
      formData.append(key, value);
    }
  }
  formData.append('_method', 'PUT');
  return new Promise((resolve, reject) => {
    Http.post(`employees/${employeeId}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

export function editPermissions(data) {
  let employeeId;
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key === 'employee_id') {
      employeeId = value;
    } else {
      formData.append(key, value);
    }
  }
  formData.append('_method', 'PUT');
  return new Promise((resolve, reject) => {
    Http.post(`employees/${employeeId}/edit-permissions`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

export function assignVessels(data) {
  let employeeId;
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key === 'employee_id') {
      employeeId = value;
    } else {
      formData.append(key, value);
    }
  }
  formData.append('_method', 'PUT');
  return new Promise((resolve, reject) => {
    Http.post(`employees/${employeeId}/assign-vessels`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

