 
module Python {
  var noneHash           = ((Math.random() - 0.5) * Math.pow(2, 32)) | 0
  var ellipsisHash       = (noneHash + 1) | 0
  var notImplementedHash = (ellipsisHash + 1) | 0

  export module Types {
    export var NoneType = buildType('NoneType', [ObjectType], {
      "__hash__": (self: PyObject) => new PyInt(noneHash),
      "__repr__": (self: PyObject) => new PyString("None")
    })
    export var EllipsisType = buildType('Ellipsis', [ObjectType], {
      "__hash__": (self: PyObject) => new PyInt(ellipsisHash),
      "__repr__": (self: PyObject) => new PyString("Ellipsis")
    })
    export var NotImplementedType = buildType('NotImplementedType', [ObjectType], {
      "__hash__": (self: PyObject) => new PyInt(notImplementedHash),
      "__repr__": (self: PyObject) => new PyString("NotImplemented")
    })
  }

  class NoneInstance extends PyInstanceBase implements PyObject {
    type = Types.NoneType
    isTrue() {return false}
  }

  class EllipsisInstance extends PyInstanceBase implements PyObject {
    type = Types.EllipsisType
    isTrue() {return true}
  }

  class NotImplementedInstance extends PyInstanceBase implements PyObject {
    type = Types.NotImplementedType
    isTrue() {return true }
  }

  export var None: PyObject = new NoneInstance()
  export var Ellipsis: PyObject = new EllipsisInstance()
  export var NotImplemented: PyObject = new NotImplementedInstance()
}
