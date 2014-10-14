
module Python {

  export module Types {
    export var StringType = buildType('str', [ObjectType], {
      // TODO: String methods
    })
  }

  export class PyString extends PyInstanceBase implements StringLikeObject {
    type = Types.StringType
    constructor(public strValue: string) {super()}
    isTrue() {return this.strValue.length > 0}
  }
}
