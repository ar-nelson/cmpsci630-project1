
module Python {
  export module Types {
    export var TupleType = buildType('tuple', [ObjectType], {
      // TODO: Implement tuple methods
    })
    export var ListType = buildType('list', [ObjectType], {
      // TODO: Implement list methods
    })
    export var SetType = buildType('set', [ObjectType], {
      // TODO: Implement tuple methods
    })
    export var FrozenSetType = buildType('frozenset', [ObjectType], {
      // TODO: Implement list methods
    })
  }

  export class PyTuple extends PyInstanceBase implements SequenceLikeObject {
    type = Types.TupleType

    constructor(public seqValue: PyObject[]) {super()}
    isTrue() {return this.seqValue.length > 0}
  }

  export class PyList extends PyInstanceBase implements SequenceLikeObject {
    type = Types.ListType

    constructor(public seqValue: PyObject[]) {super()}
    isTrue() {return this.seqValue.length > 0}
  }

  export class PySet extends PyInstanceBase implements PyObject {
    type = Types.SetType
    private hashMap = new ObjectHashMap()

    constructor(initialContents: PyObject[]) { 
      super() 
      for (var i = 0; i < initialContents.length; i++) {
        this.hashMap.put(initialContents[i], initialContents[i])
      }
    }
    isTrue() {
      return this.hashMap.length > 0
    }
  }

  export class PyFrozenSet extends PyInstanceBase implements PyObject {
    type = Types.SetType
    private hashMap = new ObjectHashMap()

    constructor(contents: PyObject[]) {
      super()
      for (var i = 0; i < contents.length; i++) {
        this.hashMap.put(contents[i], contents[i])
      }
    }
    isTrue() {
      return this.hashMap.length > 0
    }
  }
}
