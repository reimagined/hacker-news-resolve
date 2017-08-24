import Immutable from 'seamless-immutable';

function defineMethod(object, methodName, method) {
  Object.defineProperty(object, methodName, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: method
  });
}

function FakeImmutable(state) {
  if (typeof state !== 'object') {
    return state;
  }

  defineMethod(state, 'getIn', function(keys) {
    let currentRoot = this;

    for (let index in keys) {
      const key = keys[index];

      if (currentRoot[key] === undefined) {
        return undefined;
      }

      currentRoot = currentRoot[key];
    }

    return currentRoot;
  });

  defineMethod(state, 'set', function(key, value) {
    this[key] = value;
    return this;
  });

  defineMethod(state, 'setIn', function(keys, value) {
    const lastIndex = keys.length - 1;

    keys.reduce((currentRoot, key, index) => {
      if (index === lastIndex) {
        currentRoot[key] = value;
      } else if (currentRoot[key] === undefined) {
        currentRoot[key] = {};
      }

      return currentRoot[key];
    }, this);

    return this;
  });

  defineMethod(state, 'update', function(key, fn) {
    const value = FakeImmutable(this.getIn([key]));
    return this.set(key, fn(value));
  });

  defineMethod(state, 'updateIn', function(keys, fn) {
    const value = FakeImmutable(this.getIn(keys));
    return this.setIn(keys, fn(value));
  });

  defineMethod(state, 'without', function(key) {
    if (!Array.isArray(key)) {
      delete this[key];
      return this;
    }

    const count = key.length;
    const keysToAccess = key.slice(0, count - 1);
    const keyToDelete = key[count - 1];

    return this.updateIn(keysToAccess, value => {
      if (typeof value === 'object') {
        delete this[keyToDelete];
      }
      return value;
    });
  });

  return state;
}

export default (typeof window === 'undefined' ? FakeImmutable : Immutable);
