import Http from '../utils/Http';

export function login(credentials) {
  const config = {
    grant_type: 'password',
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
  };

  const data = {...credentials, ...config};

  return new Promise((resolve, reject) => {
    Http.post('oauth/token', data)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
  })
}

export function logout() {
  return new Promise((resolve, reject) => {
    Http.delete('oauth/token')
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
  })
}

export function forgotPassword(data) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  formData.append('_method', 'POST');
  return new Promise((resolve, reject) => {
    Http.post('oauth/password/forgot', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}

export function resetPassword(data) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  formData.append('_method', 'POST');
  return new Promise((resolve, reject) => {
    Http.post('oauth/password/reset', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data.error);
        reject(err);
      })
  })
}
