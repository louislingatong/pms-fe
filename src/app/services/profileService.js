import Http from '../utils/Http';

export function fetchProfile() {
  return new Promise((resolve, reject) => {
    Http.get('profile')
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
  })
}
