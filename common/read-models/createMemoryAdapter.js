export default function createMemoryAdapter() {
  const repository = new Map()

  const init = (key, onPersistDone = () => {}, onDestroy = () => {}) => {
    if (repository.get(key))
      throw new Error(`State for '${key}' alreary initialized`)
    const persistPromise = new Promise(resolve => onPersistDone(resolve))

    repository.set(key, {
      internalState: new Map(),
      internalError: null,
      api: {
        getReadable: async () => {
          await persistPromise
          return repository.get(key).internalState
        },
        getError: async () => repository.get(key).internalError
      },
      onDestroy
    })

    return repository.get(key).api
  }

  const buildProjection = collections => {
    const callbacks = collections.reduce(
      (callbacks, { name, eventHandlers, initialState }) =>
        Object.keys(eventHandlers).reduce((result, eventType) => {
          result[eventType] = (result[eventType] || []).concat({
            name,
            handler: eventHandlers[eventType],
            initialState
          })
          return result
        }, callbacks),
      {}
    )

    return Object.keys(callbacks).reduce((projection, eventType) => {
      projection[eventType] = (key, event) => {
        callbacks[eventType].forEach(({ name, handler, initialState }) => {
          const state = repository.get(key).internalState

          if (!state.has(name)) {
            state.set(name, initialState)
          }

          try {
            state.set(name, handler(state.get(name), event))
          } catch (error) {
            repository.get(key).internalError = error
          }
        })
      }
      return projection
    }, {})
  }

  const get = key => (repository.has(key) ? repository.get(key).api : null)

  const reset = key => {
    if (!repository.has(key)) return
    repository.get(key).onDestroy()
    repository.delete(key)
  }

  return {
    buildProjection,
    init,
    get,
    reset
  }
}
