
module Python {
  export module Types {
    export var DictType = buildType('dict', [ObjectType], {
      __contains__: (self: PyDict, key: PyObject) => Bool(self.hasItem(key)),
      __len__: (self: PyDict) => new PyInt(self.hashMap.length),
      __repr__: (self: PyDict) => {
        var str = "{", entries = self.entries()
        for (var i = 0; i < entries.length; i++) {
          if (i > 0) str += ", "
          str += (<StringLikeObject>entries[i][0].repr()).strValue + ": " +
            (<StringLikeObject>entries[i][1].repr()).strValue
        }
        return new PyString(str + "}")
      },
      get: (self: PyDict, key: PyObject) => {
        if (self.hasItem(key)) return self.getItem(key)
        else return None
      },
      has_key: (self: PyDict, key: PyObject) => Bool(self.hasItem(key)),
      keys: (self: PyDict) => new PyList(self.hashMap.keys()),
      items: (self: PyDict) => {
        var entries: any[] = self.entries()
        for (var i = 0; i < entries.length; i++) entries[i] = new PyTuple(entries[i])
        return new PyList(entries)
      },
      iterkeys: (self: PyDict) => new PyIter(self.hashMap.keys()),
      iteritems: (self: PyDict) => {
        var entries: any[] = self.entries()
        for (var i = 0; i < entries.length; i++) entries[i] = new PyTuple(entries[i])
        return new PyIter(entries)
      },
      itervalues: (self: PyDict) => new PyIter(self.hashMap.values()),
      values: (self: PyDict) => new PyList(self.hashMap.values()),
    })
  }

  export class PyDict extends PyInstanceBase implements DictLikeObject {
    type = Types.DictType
    hashMap = new ObjectHashMap()

    constructor(keys: PyObject[], values: PyObject[]) {
      super()
      for (var i = 0; i < keys.length; i++) {
        this.hashMap.put(keys[i], values[i])
      }
    }
    hasItem(key: PyObject): boolean {
      return this.hashMap.hasKey(key)
    }
    getItem(key: PyObject): PyObject {
      return this.hashMap.get(key)
    }
    setItem(key: PyObject, value: PyObject): boolean {
      return this.hashMap.put(key, value) !== null
    }
    deleteItem(key: PyObject): boolean {
      return this.hashMap.remove(key) !== null
    }
    isTrue() {
      return this.hashMap.length > 0
    }
    entries() {
      return this.hashMap.entries()
    }
  }
}
