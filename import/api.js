import fetch from 'isomorphic-fetch'

const endPoint = 'https://hacker-news.firebaseio.com/v0'

const fetchWithRetry = async (url, retry = 0) => {
  try {
    return await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
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
