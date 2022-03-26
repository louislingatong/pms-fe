import Http from '../utils/Http';

export function fetchAll(params) {
  return new Promise((resolve, reject) => {
    Http.get('vessel-machineries', {params})
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
    Http.get(`vessel-machineries/${id}`)
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
    Http.post('vessel-machineries', formData, {headers: {'Content-Type': 'multipart/form-data'}})
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
  let vesselMachineryId;
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key === 'vessel_machinery_id') {
      vesselMachineryId = value;
    } else {
      formData.append(key, value);
    }
  }
  formData.append('_method', 'PUT');
  return new Promise((resolve, reject) => {
    Http.post(`vessel-machineries/${vesselMachineryId}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

export function editSubCategories(data) {
  let vesselMachineryId;
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key === 'vessel_machinery_id') {
      vesselMachineryId = value;
    } else {
      formData.append(key, value);
    }
  }
  formData.append('_method', 'PUT');
  return new Promise((resolve, reject) => {
    Http.post(`vessel-machineries/${vesselMachineryId}/edit-machinery-sub-categories`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

export function exportVesselMachinery(id) {
  return new Promise((resolve, reject) => {
    Http.get(`vessel-machineries/${id}/export`, {responseType: 'blob'})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      })
  })
}

