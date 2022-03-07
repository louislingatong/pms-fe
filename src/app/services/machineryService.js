import Http from '../utils/Http';

export function fetchAll(params) {
  return new Promise((resolve, reject) => {
    Http.get('machineries', {params})
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
    Http.post('machineries', formData, {headers: {'Content-Type': 'multipart/form-data'}})
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
  let machineryId;
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key === 'machinery_id') {
      machineryId = value;
    } else {
      formData.append(key, value);
    }
  }
  formData.append('_method', 'PUT');
  return new Promise((resolve, reject) => {
    Http.post(`machineries/${machineryId}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

export function addSubCategory(data) {
  let machineryId;
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key === 'machinery_id') {
      machineryId = value;
    } else {
      formData.append(key, value);
    }
  }
  formData.append('_method', 'PUT');
  return new Promise((resolve, reject) => {
    Http.post(`machineries/${machineryId}/add-sub-category`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

