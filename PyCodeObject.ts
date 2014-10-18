 
module Python {

  export module Types {
    export var CodeType = buildType('code', [ObjectType], {})
  }

  export class PyCodeObject extends PyInstanceBase implements PyObject {
    type = Types.CodeType
    argcount: number
    nlocals: number
    stacksize: number
    hasVarargs: boolean
    hasKwArgs: boolean
    isGenerator: boolean
    code: DataView
    consts: PyObject[]
    names: string[]
    varnames: string[]
    freevars: string[]
    cellvars: string[]
    filename: string
    name: string
    // TODO: Line number information?

    constructor(bin: Bin.CodeObject) {
      super()
      this.argcount = bin.argcount
      this.nlocals = bin.nlocals
      this.stacksize = bin.stacksize
      this.hasVarargs = (bin.flags & Bin.CodeFlag.HAS_VARARGS) != 0
      this.hasKwArgs = (bin.flags & Bin.CodeFlag.HAS_KWARGS) != 0
      this.isGenerator = (bin.flags & Bin.CodeFlag.IS_GENERATOR) != 0
      this.code = bin.code
      this.consts = []
      for (var i = 0; i < bin.consts.length; i++) this.consts.push(unmarshalObject(bin.consts[i]))
      this.names = bin.names
      this.varnames = bin.varnames
      this.cellvars = bin.cellvars
      this.filename = bin.filename
      this.name = bin.name
    }

    isTrue() {return true}
  }
}