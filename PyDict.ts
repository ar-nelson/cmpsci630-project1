
module Python {
  export module Types {
    export var DictType = buildType('dict', [ObjectType], {
      // TODO: Implement dict methods
    })
  }

  export class PyDict extends PyInstanceBase implements DictLikeObject {
    type = Types.DictType

    constructor(keys: PyObject[], values: PyObject[]) {
      super()
      // TODO: Implement HashMap and use it to store dict's contents
    }
    hasItem(key: PyObject): boolean {
      // TODO: Implement me
      return false
    }
    isTrue() {
      // TODO: Return false if empty
      return true
    }
  }
}
