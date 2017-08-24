import Immutable from 'seamless-immutable';

class FakeImmutable {
  constructor(data) {
    Object.keys(data).forEach(key => this.set(key, data[key]));
  }

  get(keys) {
    let currentRoot = this;

    for (let index in keys) {
      const key = keys[index];

      if (currentRoot[key] === undefined) {
        return undefined;
      }

      currentRoot = currentRoot[key];
    }

    return currentRoot;
  }

  set(key, value) {
    this[key] = value;
    return this;
  }

  setIn(keys, value) {
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
  }

  update(key, fn) {
    const value = FakeImmutable(this.get([key]));
    return this.set(key, fn(value));
  }

  updateIn(keys, fn) {
    const value = FakeImmutable(this.get(keys));
    return this.setIn(keys, fn(value));
  }

  without(key) {
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
  }
}

export default (typeof window === 'undefined'
  ? (...args) => new FakeImmutable(...args)
  : Immutable);
