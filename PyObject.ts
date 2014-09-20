
module Python {
  export enum PyCompOp {
    LT, LE, EQ, NE, GT, GE
  }

  export interface PyObject {
    type: PyObject

    print(): void

    hasAttr(attrName: PyObject): boolean

    hasAttrString(attrName: string): boolean

    getAttr(attrName: PyObject): PyObject

    getAttrString(attrName: string): PyObject

    setAttr(attrName: PyObject, v: PyObject): boolean

    setAttrString(attrName: string, v: PyObject): boolean

    delAttr(attrName: PyObject): boolean

    delAttrString(attrName: string): boolean

    richCompare(o2: PyObject, opid: PyCompOp): PyObject

    richCompareBool(o2: PyObject, opid: PyCompOp): boolean

    cmp(o2: PyObject): number

    compare(o2: PyObject): number

    repr(): PyObject

    str(): PyObject

    // TODO: Bytes, Unicode?

    isInstance(cls: PyObject): boolean

    isSubclass(cls: PyObject): boolean

    isCallable(): boolean

    call(args: PyObject, kw: PyObject): PyObject

    callObject(args: PyObject)

    callFunctionObjArgs(...args: PyObject[])

    callMethodObjArgs(name: PyObject, ...args: PyObject[])

    hash(): number

    isTrue(): boolean

    not(): boolean

    typeCheck(type: PyObject): boolean

    getItem(key: PyObject): PyObject

    setItem(key: PyObject, v: PyObject): boolean

    delItem(key: PyObject): boolean

    dir(): PyObject

    getIter(): PyObject

    isTypeObject(): boolean
  }

  export interface PyCodeObject extends PyObject {
    argcount: number
    nlocals: number
    stacksize: number
    hasVarargs: boolean
    hasKwArgs: boolean
    isGenerator: boolean
    code: number[][]
    consts: PyObject[]
    names: string[]
    varnames: string[]
    freevars: string[]
    cellvars: string[]
    filename: string
    name: string
    // TODO: Line number information?
  }

  export class PyObjectBase {
    hasAttr(attrName: PyObject): boolean {
      if ((<any>attrName).stringValue) {
        return this.hasAttrString((<any>attrName).stringValue)
      } else return false
    }

    hasAttrString(attrName: string): boolean {
      return false
    }

    getAttr(attrName: PyObject): PyObject {
      if ((<any>attrName).stringValue) {
        return this.getAttrString((<any>attrName).stringValue)
      } else return null
    }

    getAttrString(attrName: string): PyObject {
      return null
    }

    setAttr(attrName: PyObject, v: PyObject): boolean {
      if ((<any>attrName).stringValue) {
        return this.setAttrString((<any>attrName).stringValue, v)
      } else return false
    }

    setAttrString(attrName: string, v: PyObject): boolean {
      return false
    }

    delAttr(attrName: PyObject): boolean {
      if ((<any>attrName).stringValue) {
        return this.delAttrString((<any>attrName).stringValue)
      } else return false
    }

    delAttrString(attrName: string): boolean {
      return false
    }

    richCompare(o2: PyObject, opid: PyCompOp): PyObject {
      return null
    }

    richCompareBool(o2: PyObject, opid: PyCompOp): boolean {
      return null
    }

    cmp(o2: PyObject): number {
      return null
    }

    compare(o2: PyObject): number {
      return null
    }

    isCallable(): boolean {
      return false
    }

    call(args: PyObject, kw: PyObject): PyObject {
      return null
    }

    callObject(args: PyObject): PyObject {
      return null
    }

    callFunctionObjArgs(...args: PyObject[]): PyObject {
      return null
    }

    callMethodObjArgs(name: PyObject, ...args: PyObject[]): PyObject {
      var method = this.getAttr(name)
      if (method !== null) return method.callFunctionObjArgs.apply(method, args)
      else return null
    }

    isTrue(): boolean {
      return true
    }

    not(): boolean {
      return false
    }

    getItem(key: PyObject): PyObject {
      return null
    }

    setItem(key: PyObject, v: PyObject): boolean {
      return false
    }

    delItem(key: PyObject): boolean {
      return false
    }

    getIter(): PyObject {
      return null
    }

    isTypeObject(): boolean {
      return false
    }
  }
}
