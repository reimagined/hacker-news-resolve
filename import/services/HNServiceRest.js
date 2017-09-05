/* global fetch */
require("isomorphic-fetch");
/*
A version of HNService which concumes the Firebase REST
endpoint (https://www.firebase.com/docs/rest/api/). This
is used when a user has enabled 'Offline Mode' in the
Settings panel and ensures responses can be easily fetched
and cached when paired with Service Worker. This cannot be
trivially done using just Web Sockets with the default
Firebase API and provides a sufficient fallback that works.
 */
const endPoint = "https://hacker-news.firebaseio.com/v0";
const options = {
  method: "GET",
  headers: {
    Accept: "application/json"
  }
};

const userRef = async id => fetch(`${endPoint}/user/${id}.json`, options);

const storiesRef = async path => fetch(`${endPoint}/${path}.json`, options);

const fetchItem = async id => fetch(`${endPoint}/item/${id}.json`, options);

const itemRefJSON = async id => {
  const response = await fetchItem(id);
  return response.json();
};

const fetchItems = async ids => {
  const promises = [];
  ids.forEach(id => promises.push(itemRefJSON(id)));
  return Promise.all(promises);
};

module.exports = {
  userRef,
  storiesRef,
  fetchItem,
  fetchItems
};
