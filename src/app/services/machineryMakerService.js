import Http from '../utils/Http';

export function fetchAll(params) {
  return new Promise((resolve, reject) => {
    Http.get('machinery-makers', {params})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      })
  })
}
