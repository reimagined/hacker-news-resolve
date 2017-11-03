import fetch from 'isomorphic-fetch'
import { EOL } from 'os'

const endPoint = 'https://hacker-news.firebaseio.com/v0'
const timeout = 15000

const wait = (time, result) =>
  new Promise(resolve => setTimeout(() => resolve(result), time))

const fetchWithRetry = async (url, retry = 0) => {
  try {
    const waitResult = {}

    const response = await Promise.race([
      fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }),
      wait(timeout, waitResult)
    ])

    if (response === waitResult) {
      console.error(`${EOL}Fetch timeout (${timeout} ms)`)
      process.exit(1)
    }

    return response
  } catch (e) {
    if (retry <= 3) {
      return fetchWithRetry(url, retry + 1)
    }

    throw e
  }
}

const fetchStoryIds = async path => {
  const response = await fetchWithRetry(`${endPoint}/${path}.json`)
  return await response.json()
}

const fetchItem = async id => {
  const response = await fetchWithRetry(`${endPoint}/item/${id}.json`)
  return await response.json()
}

const fetchItems = ids => {
  return Promise.all(ids.map(fetchItem))
}

export default {
  fetchStoryIds,
  fetchItems
}
