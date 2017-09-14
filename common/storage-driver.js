import NeDB from 'nedb'

export const storage = {
  init: db =>
    new Promise((resolve, reject) =>
      db.loadDatabase(error => (error ? reject(error) : resolve()))
    ),

  createIndex: (db, fieldName) =>
    new Promise((resolve, reject) =>
      db.ensureIndex(
        { fieldName },
        error => (error ? reject(error) : resolve())
      )
    ),

  prepare: async filename => {
    const db = new NeDB({ filename })
    await storage.init(db)
    await storage.createIndex(db, 'type')
    await storage.createIndex(db, 'aggregateId')
    return db
  },

  loadEvents: (query, callback) => db =>
    new Promise((resolve, reject) =>
      db
        .find(query)
        .sort({ timestamp: 1 })
        .exec((error, events) => {
          if (error) {
            reject(error)
          } else {
            events.forEach(callback)
            resolve()
          }
        })
    ),

  saveEvent: event => db =>
    new Promise((resolve, reject) =>
      db.insert(event, error => (error ? reject(error) : resolve()))
    )
}

export default function({ pathToFile }) {
  const prepareStorage = storage.prepare(pathToFile)

  return {
    saveEvent: event => prepareStorage.then(storage.saveEvent(event)),
    loadEventsByTypes: (types, callback) =>
      prepareStorage.then(
        storage.loadEvents({ type: { $in: types } }, callback)
      ),
    loadEventsByAggregateId: (ids, callback) =>
      prepareStorage.then(
        storage.loadEvents({ aggregateId: { $in: ids } }, callback)
      )
  }
}
