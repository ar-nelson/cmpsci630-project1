
module Python {
  export module Types {
    export var DictType = buildType('dict', [ObjectType], {
      // TODO: Implement dict methods
    })
  }

  export class PyDict extends PyInstanceBase implements DictLikeObject {
    type = Types.DictType
    private hashMap = new ObjectHashMap()

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
