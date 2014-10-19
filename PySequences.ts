
module Python {
  export module Types {
    export var TupleType = buildType('tuple', [ObjectType], {
      __contains__: (self: PyTuple, value: PyObject) => {
        for (var i = 0; i < self.seqValue.length; i++) {
          var cmp = value.richCompare(self.seqValue[i], PyCompOp.EQ)
          if (cmp === NotImplemented) cmp = self.seqValue[i].richCompare(value, PyCompOp.EQ)
          if (cmp === NotImplemented) cmp = value.richCompare(self.seqValue[i], PyCompOp.IS)
          if (cmp !== NotImplemented && cmp.isTrue()) return True
        }
        return False
      },
      __getitem__: (self: PyTuple, index: PyInt) => {
        if (index.numberSize !== NumberSize.INT) throw Errors.typeError(
          "tuple indices must be integers, not " + index.type.name)
        var n = index.intValue()
        while (n < 0) n += self.seqValue.length
        if (n > self.seqValue.length) throw Errors.indexError("tuple index out of range")
        return self.seqValue[n]
      },
      __getslice__: (self: PyTuple, from: PyInt, to: PyInt) => {
        if (from.numberSize !== NumberSize.INT) throw Errors.typeError(
          "tuple indices must be integers, not " + from.type.name)
        if (to.numberSize !== NumberSize.INT) throw Errors.typeError(
          "tuple indices must be integers, not " + to.type.name)
        var i = from.intValue(), j = from.intValue()
        while (i < 0) i += self.seqValue.length
        while (j < 0) j += self.seqValue.length
        if (i > self.seqValue.length) i = self.seqValue.length
        if (j > self.seqValue.length) j = self.seqValue.length
        return new PyTuple(self.seqValue.slice(i, j))
      },
      __iter__: (self: PyTuple) => new PyIter(self.seqValue),
      __len__: (self: PyTuple) => new PyInt(self.seqValue.length),
      __repr__: (self: PyTuple) => {
        var str = "("
        for (var i = 0; i < self.seqValue.length; i++) {
          if (i > 0) str += " "
          str += (<StringLikeObject>self.seqValue[i].repr()).strValue + ","
        }
        return new PyString(str + ")")
      },
    })
    export var ListType = buildType('list', [ObjectType], {
      __contains__: (self: PyList, value: PyObject) => {
        for (var i = 0; i < self.seqValue.length; i++) {
          var cmp = value.richCompare(self.seqValue[i], PyCompOp.EQ)
          if (cmp === NotImplemented) cmp = self.seqValue[i].richCompare(value, PyCompOp.EQ)
          if (cmp === NotImplemented) cmp = value.richCompare(self.seqValue[i], PyCompOp.IS)
          if (cmp !== NotImplemented && cmp.isTrue()) return True
        }
        return False
      },
      __delitem__: (self: PyList, index: PyInt) => {
        if (index.numberSize !== NumberSize.INT) throw Errors.typeError(
          "list indices must be integers, not " + index.type.name)
        var n = index.intValue()
        while (n < 0) n += self.seqValue.length
        if (n > self.seqValue.length) throw Errors.indexError("list index out of range")
        delete self.seqValue[n]
        return None
      },
      __getitem__: (self: PyList, index: PyInt) => {
        if (index.numberSize !== NumberSize.INT) throw Errors.typeError(
          "list indices must be integers, not " + index.type.name)
        var n = index.intValue()
        while (n < 0) n += self.seqValue.length
        if (n > self.seqValue.length) throw Errors.indexError("list index out of range")
        return self.seqValue[n]
      },
      __getslice__: (self: PyList, from: PyInt, to: PyInt) => {
        if (from.numberSize !== NumberSize.INT) throw Errors.typeError(
          "list indices must be integers, not " + from.type.name)
        if (to.numberSize !== NumberSize.INT) throw Errors.typeError(
          "list indices must be integers, not " + to.type.name)
        var i = from.intValue(), j = from.intValue()
        while (i < 0) i += self.seqValue.length
        while (j < 0) j += self.seqValue.length
        if (i > self.seqValue.length) i = self.seqValue.length
        if (j > self.seqValue.length) j = self.seqValue.length
        return new PyList(self.seqValue.slice(i, j))
      },
      __iter__: (self: PyList) => new PyIter(self.seqValue),
      __len__: (self: PyList) => new PyInt(self.seqValue.length),
      __repr__: (self: PyList) => {
        var str = "["
        for (var i = 0; i < self.seqValue.length; i++) {
          if (i > 0) str += ", "
          str += (<StringLikeObject>self.seqValue[i].repr()).strValue
        }
        return new PyString(str + "]")
      },
      __setitem__: (self: PyList, index: PyInt, value: PyObject) => {
        if (index.numberSize !== NumberSize.INT) throw Errors.typeError(
          "list indices must be integers, not " + index.type.name)
        var n = index.intValue()
        while (n < 0) n += self.seqValue.length
        if (n > self.seqValue.length) throw Errors.indexError("list index out of range")
        self.seqValue[n] = value
        return None
      },
      append: (self: PyList, value: PyObject) => {
        self.seqValue.push(value)
        return None
      }
    })
    export var SetType = buildType('set', [ObjectType], {
      // TODO: Implement tuple methods
    })
    export var FrozenSetType = buildType('frozenset', [ObjectType], {
      // TODO: Implement list methods
    })
    export var IterType = buildType('iter', [ObjectType], {
      __iter__: (self: PyIter) => self,
      next: (self: PyIter) => {
        if (self.i >= self.contents.length) throw buildException(Types.StopIteration,
          "reached end of iterator")
        else return self.contents[self.i++]
      }
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

  export class PyIter extends PyInstanceBase implements PyObject {
    type = Types.IterType
    i: number = 0

    constructor(public contents: PyObject[]) {
      super()
    }

    isTrue() {return this.i < this.contents.length}
  }
}
