
module Python {

  export module Types {
    export var StringType = buildType('str', [ObjectType], {
      __str__: (self: PyString) => self,
      __repr__: (self: PyString) => new PyString(JSON.stringify(self.strValue))
      // TODO: String methods
    })
  }

  export class PyString extends PyInstanceBase implements StringLikeObject {
    type = Types.StringType
    constructor(public strValue: string) {super()}
    isTrue() {return this.strValue.length > 0}
    str() {return this}
    repr() {return new PyString(JSON.stringify(this.strValue))}
  }
}
