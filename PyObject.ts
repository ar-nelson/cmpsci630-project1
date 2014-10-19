
module Python {
  export enum PyCompOp {
    LT, LE, EQ, NE, GT, GE, IN, NOT_IN, IS, IS_NOT, EXCEPTION_MATCH
  }

  export var cmp_op = ['<', '<=', '==', '!=', '>', '>=', 'in', 'not in', 'is', 'is not', 'exception match', 'BAD']

  export module Errors {
    // Stub methods intended to generate built-in error classes.
    // Another file should replace these with functions that generate actual
    // Python error objects.
    export var attributeError: (message: string) => any = (message) => {
      return new Error("AttributeError: " + message)
    }
    export var typeError: (message: string) => any = (message) => {
      return new Error("TypeError: " + message)
    }
    export var indexError: (message: string) => any = (message) => {
      return new Error("IndexError: " + message)
    }
    export var keyError: (message: string) => any = (message) => {
      return new Error("KeyError: " + message)
    }
    export var nameError: (message: string) => any = (message) => {
      return new Error("NameError: " + message)
    }
  }

  export var strData = "strValue"
  export var seqData = "seqValue"

  var nextId: number = 0
  var internedStrings: { [key: string]: PyString } = {}

  function pythonifyString(str: string): PyString {
    if (Object.prototype.hasOwnProperty.call(internedStrings, str)) {
      return internedStrings[str]
    } else {
      var strObj = new PyString(str)
      if (str != "__proto__") internedStrings[str] = strObj
      return strObj
    }
  }

  export interface PyObject {
    id: number
    type: PyTypeObject
    hasAttr(attrName: PyObject): boolean
    hasAttrString(attrName: string): boolean
    getAttr(attrName: PyObject): PyObject
    getAttrString(attrName: string): PyObject
    setAttr(attrName: PyObject, v: PyObject): boolean
    setAttrString(attrName: string, v: PyObject): boolean
    delAttr(attrName: PyObject): boolean
    delAttrString(attrName: string): boolean
    richCompare(o2: PyObject, opid: PyCompOp): PyObject
    compare(o2: PyObject): number
    repr(): PyObject
    str(): PyObject
    isInstance(cls: PyObject): boolean
    isSubclass(cls: PyObject): boolean
    isCallable(): boolean
    call(args: PyObject, kw?: PyObject): PyObject
    callObjArgs(...args: PyObject[]): PyObject
    callMethod(name: PyObject, args: PyObject, kw?: PyObject): PyObject
    callMethodObjArgs(name: string, ...args: PyObject[]): PyObject
    hash(): number
    isTrue(): boolean
    not(): PyObject
    typeCheck(type: PyTypeObject): boolean
    getItem(key: PyObject): PyObject
    setItem(key: PyObject, v: PyObject): boolean
    delItem(key: PyObject): boolean
    getIter(): PyObject
    isTypeObject(): boolean
    getInstanceForm(instance: PyObject): PyObject
  }

  export enum NumberSize { INT, LONG, FLOAT, COMPLEX }

  export interface ComplexLikeObject extends PyObject {
    numberSize: NumberSize
    realValue(): number
    imagValue(): number
  }

  export interface NumberLikeObject extends ComplexLikeObject {
    intValue(): number
    floatValue(): number
  }

  export interface StringLikeObject extends PyObject {
    strValue: string
  }

  export interface SequenceLikeObject extends PyObject {
    seqValue: PyObject[]
  }

  export interface DictLikeObject extends PyObject {
    hasItem(key: PyObject): boolean
    entries(): PyObject[][]
  }

  export class PyObjectBase {
    id: number
    constructor() {this.id = nextId++}
    hasAttrString(attrName: string): boolean {
      return (<any>this).hasAttr(pythonifyString(attrName))
    }
    getAttrString(attrName: string): PyObject {
      return (<any>this).getAttr(pythonifyString(attrName))
    }
    setAttrString(attrName: string, v: PyObject): boolean {
      return (<any>this).setAttr(pythonifyString(attrName), v) 
    }
    delAttrString(attrName: string): boolean {
      return (<any>this).delAttr(pythonifyString(attrName))
    }
    richCompare(o2: PyObject, opid: PyCompOp): PyObject {
      var method: string = null
      var n1: NumberLikeObject, n2: NumberLikeObject
      switch (opid) {
        case PyCompOp.LT:
          if (this.hasAttrString("__lt__")) method = "__lt__"
          break
        case PyCompOp.LE:
          if (this.hasAttrString("__le__")) method = "__le__"
          break
        case PyCompOp.EQ:
          if (this.hasAttrString("__eq__")) method = "__eq__"
          break
        case PyCompOp.NE:
          if (this.hasAttrString("__ne__")) method = "__ne__"
          break
        case PyCompOp.GT:
          if (this.hasAttrString("__gt__")) method = "__gt__"
          break
        case PyCompOp.GE:
          if (this.hasAttrString("__ge__")) method = "__ge__"
          break
        case PyCompOp.IN:
          if (this.hasAttrString("__contains__")) {
            return this.callMethodObjArgs("__contains__", o2)
          } else return NotImplemented
        case PyCompOp.NOT_IN:
          if (this.hasAttrString("__contains__")) {
            return this.callMethodObjArgs("__contains__", o2).not()
          } else return NotImplemented
        case PyCompOp.IS:
          n1 = <NumberLikeObject><any>this; n2 = <NumberLikeObject><any>o2
          if (n1.numberSize !== undefined && n2.numberSize !== undefined && n1.type === n2.type) {
            switch (n1.numberSize ) {
              case NumberSize.INT: return Bool(n1.intValue() === n2.intValue())
              case NumberSize.LONG: // TODO: longs
              case NumberSize.FLOAT: return Bool(n1.floatValue() === n2.floatValue())
              case NumberSize.COMPLEX: return Bool(
                n1.realValue() === n2.realValue() && n1.imagValue() === n2.imagValue())
            }
          }
          return Bool(this === o2)
        case PyCompOp.IS_NOT:
          n1 = <NumberLikeObject><any>this; n2 = <NumberLikeObject><any>o2
          if (n1.numberSize !== undefined && n2.numberSize !== undefined && n1.type === n2.type) {
            switch (n1.numberSize) {
              case NumberSize.INT: return Bool(n1.intValue() !== n2.intValue())
              case NumberSize.LONG: // TODO: longs
              case NumberSize.FLOAT: return Bool(n1.floatValue() !== n2.floatValue())
              case NumberSize.COMPLEX: return Bool(
                n1.realValue() === n2.realValue() && n1.imagValue() !== n2.imagValue())
            }
          }
          return Bool(this !== o2)
        // TODO: exception match
      }
      if (method) return this.callMethodObjArgs(method, o2)
      else if (this.hasAttrString("__cmp__")) {
        var result = this.callMethodObjArgs("__cmp__", o2)
        if (result === NotImplemented) return NotImplemented
        var n = (<NumberLikeObject><any>result).intValue()
        switch (opid) {
          case PyCompOp.LT: return Bool(n < 0)
          case PyCompOp.LE: return Bool(n <= 0)
          case PyCompOp.EQ: return Bool(n == 0)
          case PyCompOp.NE: return Bool(n != 0)
          case PyCompOp.GT: return Bool(n > 0)
          case PyCompOp.GE: return Bool(n >= 0)
        }
      }
      return NotImplemented
    }
    compare(o2: PyObject): number {
      var result = this.callMethodObjArgs("__cmp__", o2)
      if ((<NumberLikeObject>result).intValue) return (<NumberLikeObject>result).intValue()
      else if (result === NotImplemented) Errors.typeError("cannot compare " +
        (<any>this).type.name + " and " + o2.type.name)
      else throw Errors.typeError("__cmp__ must return an int (got " + result.type.name + ")")
    }
    str(): PyObject {
      if (this.hasAttrString("__str__")) return this.callMethodObjArgs("__str__")
      else return (<any>this).repr()
    }
    repr(): PyObject {
      if (this.hasAttrString("__repr__")) return this.callMethodObjArgs("__repr__")
      else return new PyString("<'" + (<any>this).type.name + "' object at 0x" +
        this.id.toString(16) + ">")
    }
    isInstance(cls: PyObject): boolean {
      return (<any>this).type.isSubclass(cls.type)
    }
    isCallable() {return this.hasAttrString("__call__")}
    call(args: PyObject, kw?: PyObject): PyObject {
      if (this.isCallable()) return this.getAttrString("__call__").call(args, kw)
      else throw Errors.typeError("object of type '" + (<any>this).type.name + "' is not callable")
    }
    callObjArgs(...args: PyObject[]): PyObject {
      return this.call(new PyTuple(args))
    }
    callMethod(name: PyObject, args: SequenceLikeObject, kw?: DictLikeObject): PyObject {
      if (!args.hasOwnProperty(seqData)) throw Errors.typeError("args must be a tuple or list")
      if ((<any>this).type.hasAttr(name)) {
        var method: PyObject = (<any>this).type.getAttr(name)
        return method.call(new PyTuple([<any>this].concat(args.seqValue)), kw)
      } else {
        var method: PyObject = (<any>this).getAttr(name)
        return method.call(args, kw)
      }
    }
    callMethodObjArgs(name: string, ...args: PyObject[]): PyObject {
      return this.callMethod(pythonifyString(name), new PyTuple(args))
    }
    getItem(key: PyObject): PyObject {
      return this.callMethodObjArgs("__getitem__", key)
    }
    setItem(key: PyObject, v: PyObject): boolean {
      return this.callMethodObjArgs("__setitem__", key, v).isTrue()
    }
    delItem(key: PyObject): boolean {
      return this.callMethodObjArgs("__delitem__", key).isTrue()
    }
    hash(): number {
      if (this.hasAttrString("__hash__")) {
        return (<NumberLikeObject><any>this.callMethodObjArgs("__hash__")).intValue()
      } else return this.id
    }
    not(): PyObject {return Bool(!(<any>this).isTrue())}
    typeCheck(type: PyTypeObject): boolean {
      return this.isInstance(type) || (<any>this).isSubclass(type)
    }
    getIter(): PyObject {
      // TODO: Confirm whether this should be a method call or a field reference.
      return this.callMethodObjArgs("__iter__")
    }
    getInstanceForm(instance: PyObject): PyObject {return null}
    toString() {return this.repr()[strData]}
  }

  export class PyTypeObject extends PyObjectBase implements PyObject {
    type: PyTypeObject = null
    constructor(
      public name: string,
      public builtin: boolean,
      public __dict__: DictLikeObject,
      private bases: PyTypeObject[] = [Types.ObjectType]
    ) {super()}

    private hasTypeAttr(attrName: PyObject): boolean {
      if (this.__dict__.hasItem(attrName)) return true
      else for (var i = 0; i < this.bases.length; i++) {
        if (this.bases[i].hasTypeAttr(attrName)) return true
      }
      return false
    }
    private getTypeAttr(attrName: PyObject): PyObject {
      if (this.__dict__.hasItem(attrName)) return this.__dict__.getItem(attrName)
      else for (var i = 0; i < this.bases.length; i++) {
        var baseItem = this.bases[i].getTypeAttr(attrName)
        if (baseItem !== null) return baseItem
      }
      return null
    }

    hasAttr(attrName: PyObject) {
      if (attrName.hasOwnProperty(strData)) {
        switch (attrName[strData]) {
          case "__dict__": return true
          case "__bases__": return true
        }
      }
      return this.hasTypeAttr(attrName)
    }
    getAttr(attrName: PyObject) {
      if (attrName.hasOwnProperty(strData)) {
        switch (attrName[strData]) {
          case "__dict__": return this.__dict__
          case "__bases__": return new PyTuple(this.bases)
        }
      }
      return this.getTypeAttr(attrName)
    }
    setAttr(attrName: PyObject, v: PyObject): boolean {
      if (this.builtin) {
        throw Errors.typeError("can't set attributes of built-in/extension type '" + this.name +
          "'")
      }
      throw Errors.typeError("can't set attributes of type '" + this.name + "'")
      return null
    }
    delAttr(attrName: PyObject): boolean {
      if (this.builtin) {
        throw Errors.typeError("can't delete attributes of built-in/extension type '" + this.name +
          "'")
      }
      throw Errors.typeError("can't delete attributes of type '" + this.name + "'")
      return null
    }
    repr(): PyObject {return pythonifyString("<type '" + this.name + "'>")}
    isSubclass(cls: PyObject) {
      if (cls === this) return true
      for (var i = 0; i < this.bases.length; i++) if (this.bases[i].isSubclass(cls)) return true
      return false
    }
    isTrue() {return true}
    isTypeObject() {return true}
  }

  export class PyInstanceBase extends PyObjectBase {
    hasAttr(attrName: PyObject) {
      if ((<any>this).type.hasAttr(attrName)) {
        var typeAttr: PyObject = (<any>this).type.getAttr(attrName).getInstanceForm(this)
        if (typeAttr) return true
      }
      return false
    }
    getAttr(attrName: PyObject) {
      if ((<any>this).type.hasAttr(attrName)) {
        var typeAttr: PyObject = (<any>this).type.getAttr(attrName).getInstanceForm(this)
        if (typeAttr) return typeAttr
      }
      throw Errors.attributeError("'" + (<any>this).type.name + "' object has no attribute " +
        attrName)
    }
    setAttr(attrName: PyObject, v: PyObject): boolean {
      if ((<any>this).type.hasAttr(attrName)) {
        var typeAttr: PyObject = (<any>this).type.getAttr(attrName).getInstanceForm(this)
        if (typeAttr) throw Errors.attributeError("'" + (<any>this).type.name +
          "' object attribute " + attrName + " is read-only")
      }
      throw Errors.attributeError("'" + (<any>this).type.name + "' object has no attribute " +
        attrName)
      return null
    }
    delAttr(attrName: PyObject): boolean {
      if ((<any>this).type.hasAttr(attrName)) {
        var typeAttr: PyObject = (<any>this).type.getAttr(attrName).getInstanceForm(this)
        if (typeAttr) throw Errors.attributeError("'" + (<any>this).type.name +
          "' object attribute " + attrName + " is read-only")
      }
      throw Errors.attributeError("'" + (<any>this).type.name + "' object has no attribute " +
        attrName)
      return null
    }
    isSubclass(cls: PyObject) {return false }
    isTypeObject() {return false }
  }

  export class DictProxy extends PyInstanceBase implements PyObject, DictLikeObject {
    type: PyTypeObject = null
    
    constructor(public contents: { [key: string]: PyObject }) {super()}
    
    repr() {return pythonifyString("<built-in dict>")}
    isSubclass(cls: PyObject) {return false}
    isTrue() {return true }
    hasItem(key: PyObject) {
      if (key.hasOwnProperty(strData))
        return Object.prototype.hasOwnProperty.call(this.contents, key[strData])
      else return false
    }
    getItem(key: PyObject) {
      if (key.hasOwnProperty(strData)) {
        var str: string = key[strData]
        if (Object.prototype.hasOwnProperty.call(this.contents, str)) return this.contents[str]
      }
      throw Errors.keyError(key.repr()[strData])
    }
    isTypeObject() {return false}
    entries(): PyObject[][] {
      var entries: PyObject[][] = []
      for (var kstr in this.contents) if (Object.prototype.hasOwnProperty.call(kstr)) {
        entries.push([pythonifyString(kstr), this.contents[kstr]])
      }
      return entries
    }
  }

  export module Types {
    export var ObjectType = new PyTypeObject('object', true, new DictProxy({}), [])
    export var TypeType = new PyTypeObject('type', true, new DictProxy({}), [ObjectType])
    export var DictProxyType = new PyTypeObject('dictproxy', true, new DictProxy({}), [ObjectType])
    export var MethodDescriptorType = new PyTypeObject('method_descriptor', true, new DictProxy({}), [ObjectType])
    export var BuiltinMethodType = new PyTypeObject('builtin_function_or_method', true, new DictProxy({}), [ObjectType])
  }

  PyTypeObject.prototype.type = Types.TypeType
  DictProxy.prototype.type = Types.DictProxyType

  export class BuiltinMethod extends PyInstanceBase implements PyObject {
    type: PyTypeObject = Types.MethodDescriptorType
    constructor(
      private typeName: string,
      public name: string,
      private action: (args: SequenceLikeObject, kwargs?: DictLikeObject) => PyObject
    ) {super()}
    
    repr() {
      return pythonifyString("<method '" + this.name + "' of '" + this.typeName + "' objects>")
    }

    call(args: SequenceLikeObject, kw?: DictLikeObject): PyObject {return this.action(args, kw)}

    isTrue() {return true}

    getInstanceForm(instance: PyObject): PyObject {
      return new BuiltinInstanceMethod(instance, this.name, this.action)
    }
  }

  class BuiltinInstanceMethod extends PyInstanceBase implements PyObject {
    type: PyTypeObject = Types.BuiltinMethodType
    constructor(
      private instance: PyObject,
      public name: string,
      private action: (args: SequenceLikeObject, kwargs?: DictLikeObject) => PyObject
    ) {super()}

    repr() {
      return pythonifyString("<built-in method " + this.name + " of " + this.instance.type.name +
        " instance at 0x" + this.instance.id.toString(16) + ">")
    }

    call(args: SequenceLikeObject, kw?: DictLikeObject): PyObject {
      return this.action(new PyTuple([this.instance].concat(args.seqValue)), kw)
    }

    isTrue() {return true}
  }

  export function buildFunction(name: string, fn: Function, minArgs = fn.length, maxArgs = fn.length):
      (args: SequenceLikeObject, kw?: DictLikeObject) => PyObject {
    return (args: SequenceLikeObject, kw?: DictLikeObject) => {
      console.dir(args.seqValue)
      if (kw && kw.isTrue()) throw Errors.typeError("method " + name +
        " doesn't take keyword arguments")
      if (args.seqValue.length >= minArgs && args.seqValue.length <= maxArgs) {
        return fn.apply(null, args.seqValue)
      } else {
        var amount = minArgs === maxArgs ? fn.length.toString() : (args.seqValue.length < minArgs ?
          "at least " + minArgs : "at most " + maxArgs)
        throw Errors.typeError(name + " expected " + amount + " arguments, got " +
          args.seqValue.length)
      }
    }
  }
  
  export function buildType(
    name: string,
    bases: PyTypeObject[],
    methods: {[key: string]: Function}
  ): PyTypeObject {
    var newMethods: {[key: string]: BuiltinMethod} = {}
    for (var mname in methods) if (methods.hasOwnProperty(mname)) {
      newMethods[mname] = new BuiltinMethod(name, mname, buildFunction(mname, methods[mname]))
    }
    return new PyTypeObject(name, true, new DictProxy(newMethods), bases)
  }
}
