
module Python {
  interface StackFrame {
    pc: number
    code: PyCodeObject
  }

  export class Interpreter {
    private pc: number = 0
    private stack: PyObject[] = []
    private code: PyCodeObject
    private codeStack: StackFrame[] = []
    private locals: { [name: string]: PyObject } = {}
    private localsStack: { [name: string]: PyObject }[] = [this.locals]
    private globals: { [name: string]: PyObject } = {}

    constructor(code: Bin.CodeObject, public importer?: Importer, public printer?: Printer) {
      this.code = <any>unmarshalObject(code)
    }

    exec(): void {
      while (true) {
        // FIXME: pc might not actually be an index into the code array.
        // Need to figure out how instructions are numbered.
        while (this.pc < this.code.code.length) {
          var instr = this.code.code[this.pc++]
          this.execInstr(instr[0], instr.length > 1 ? instr[1] : null)
        }
        if (this.codeStack.length === 0) break
        else {
          var nextFrame = this.codeStack.pop()
          this.pc = nextFrame.pc
          this.code = nextFrame.code
        }
      }
    }

    private execInstr(opcode: Bin.Opcode, arg?: number): void {
      // Because JavaScript doesn't have block scope, these variables are used
      // as general-purpose "registers" by all of the switch branches, in order
      // to avoid the hassle of keeping track of which names have been defined.
      var a: any, b: any, c: any, d: any
      
      switch (opcode) {
        case Bin.Opcode.POP_TOP:
          this.stack.pop()
          break
        case Bin.Opcode.ROT_TWO:
          a = this.stack.pop(); b = this.stack.pop()
          this.stack.push(a); this.stack.push(b)
          break
        // ROT_THREE
        case Bin.Opcode.DUP_TOP:
          a = this.stack.pop()
          this.stack.push(a); this.stack.push(a)
          break
        // ROT_FOUR
        case Bin.Opcode.NOP:
          break

        // TODO: Implement remaining opcodes here.

        default:
          throw new Error("Unimplemented opcode: " +
             (Bin.Opcode[opcode] || "0x" + opcode.toString(16)))
      }
    }
  }

  export interface Printer {
    /** Prints `text` to the console, without a trailing newline. */
    print(text: string): void
    /** Prints a newline character to the console. */
    printNewline(text: string): void
  }

  export interface Importer {
    /**
     * Attempts to import the module `moduleName`, and calls `callback` with a binary ArrayBuffer
     * if the import succeeded. The first argument of `callback` is an error, which will be
     * non-null if the import failed.
     */
    importModule(moduleName: string, callback: (err: any, bin: ArrayBuffer) => void): void
  }
}
