﻿
module Python {
  class Interpreter {
    pc: number
    stack: PyObject[] = []
    code: PyCodeObject
    codeStack: PyCodeObject[]
    locals: { [name: string]: PyObject } = {}
    localsStack: { [name: string]: PyObject }[] = [this.locals]
    globals: { [name: string]: PyObject } = {}

    constructor(code: Bin.CodeObject, public importer?: Importer, public printer?: Printer) {
      // TODO: Populate pc, code, codeStack, etc.
    }
  }

  interface Printer {
    /** Prints `text` to the console, without a trailing newline. */
    print(text: string): void
    /** Prints a newline character to the console. */
    printNewline(text: string): void
  }

  interface Importer {
    /**
     * Attempts to import the module `moduleName`, and calls `callback` with a binary ArrayBuffer
     * if the import succeeded. The first argument of `callback` is an error, which will be
     * non-null if the import failed.
     */
    importModule(moduleName: string, callback: (err: any, bin: ArrayBuffer) => void): void
  }
}
