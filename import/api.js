import fetch from 'isomorphic-fetch'

const endPoint = 'https://hacker-news.firebaseio.com/v0'
const timeout = 15000

const wait = (time, result) =>
  new Promise(resolve => setTimeout(() => resolve(result), time))

const fetchSingle = url =>
  fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.text())
    }
    return response.json()
  })

const fetchWithRetry = url => {
  return Promise.race([
    new Promise(async (resolve, reject) => {
      let error
      for (let retry = 0; retry <= 5; retry++) {
        try {
          resolve(await fetchSingle(url))
        } catch (err) {
          error = err
        }
      }
      reject(error)
    }),
    wait(timeout)
  ])
}

const fetchStoryIds = path => fetchWithRetry(`${endPoint}/${path}.json`)

const fetchItem = id => fetchWithRetry(`${endPoint}/item/${id}.json`)

const fetchItems = ids => {
  return Promise.all(ids.map(fetchItem))
}

export default {
  fetchStoryIds,
  fetchItems
}
