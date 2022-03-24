import Http from '../utils/Http';

export function fetchAll(params) {
  return new Promise((resolve, reject) => {
    Http.get('works', {params})
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
    if (key === 'file' && value.length) {
      formData.append(key, value[0])
    } else {
      formData.append(key, value);
    }
  }
  formData.append('_method', 'POST');
  return new Promise((resolve, reject) => {
    Http.post('works', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

export function count(params) {
  return new Promise((resolve, reject) => {
    Http.get('works/count', {params})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      })
  })
}

export function exportWorks(params) {
  return new Promise((resolve, reject) => {
    Http.get('works/export', {params, responseType: 'blob'})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      })
  })
}

export function exportWorkHistory(id) {
  return new Promise((resolve, reject) => {
    Http.get(`works/${id}/export`, {responseType: 'blob'})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      })
  })
}

export function downloadFile(path) {
  return new Promise((resolve, reject) => {
    Http.get( 'works/file-download', {params: {path}, responseType: 'blob'})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      })
  })
}
