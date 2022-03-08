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
