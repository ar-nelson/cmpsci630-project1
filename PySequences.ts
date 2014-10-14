
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

    constructor(initialContents: PyObject[]) { 
      super() 
      // TODO: Implement HashMap and use it to store set's contents
    }
    isTrue() {
      // TODO: Return false if empty
      return true
    }
  }

  export class PyFrozenSet extends PyInstanceBase implements PyObject {
    type = Types.SetType

    constructor(contents: PyObject[]) {
      super()
      // TODO: Implement HashMap and use it to store set's contents
    }
    isTrue() {
      // TODO: Return false if empty
      return true
    }
  }
}
