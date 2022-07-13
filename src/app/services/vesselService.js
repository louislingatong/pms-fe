import Http from '../utils/Http';

export function fetchAll(params) {
  return new Promise((resolve, reject) => {
    Http.get('vessels', {params})
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
    Http.get(`vessels/${id}`)
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
    Http.post('vessels', formData, {headers: {'Content-Type': 'multipart/form-data'}})
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
  let vesselId;
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key === 'vessel_id') {
      vesselId = value;
    } else {
      formData.append(key, value);
    }
  }
  formData.append('_method', 'PUT');
  return new Promise((resolve, reject) => {
    Http.post(`vessels/${vesselId}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

export function remove(data) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  formData.append('_method', 'DELETE');
  return new Promise((resolve, reject) => {
    Http.post('vessels', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}
