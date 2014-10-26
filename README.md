# CMPSCI 630 Python Interpreter

Adam Nelson and Arpita Raveendran

---

This is an in-browser Python bytecode (`.pyc`) interpreter. It can evaluate a limited subset of Python 2.7._x_ bytecode, which includes the following features:

* Primitive types: `bool`, `int`, `float`, `str`, `tuple`, `list`, `set`, `dict`
* Flow control: if statements, loops, list comprehensions, and `try`/`except`/`finally`
* Functions: Functions can be defined and called, with support for named arguments, default values, `*args`, and `**kwargs`
* Type system: almost all built-in types are defined, subtyping relationships work, and operators and built-in functions work by calling special methods (`__foo__`) on objects
* Sequences: strings, lists, and tuples are iterable, indexable, and sliceable
* Exceptions: Python exceptions work, and even generate bytecode tracebacks. `except` statements pay attention to subtyping relationships between exception types
* `print` and `raw_input`
* Built-in methods: a limited collection of string and sequence methods are implemented

The following features are **not** included, due to time constraints:

* User-defined classes
* Closures (functions that don't reference their containing scope don't create closures, and therefore can still be defined)
* Import statements and the standard libraries
* Many built-in functions, both in the global scope and as methods on built-in types
* Class attributes (objects can have type-level methods, but not type-level attributes)
* The ability to access the raised exception/traceback object in the body of an `except` statement
* The `long` and `unicode` types
* The `with` statement

## Compiling and Running

There are two ways to run the interpreter's HTML UI:

### Option 1

This project is a Visual Studio 2013 solution; simply load the project in VS2013 (or VS2013 Express Web), and click Run.

### Option 2

Compile the TypeScript files manually. 

1. Install node.js and npm. then install TypeScript:

        > npm install -g typescript
 
2. Execute the following command in the project folder:

        > tsc @files.txt

3. Open `index.html` in any modern browser, and everything should work!

## The HTML UI

The interface has two panes. The right pane contains a list of test cases, which you can click to execute, as well as an upload button, which lets you run your own `.pyc` files. The left pane is the output pane; by default, it displays the console output of the `.pyc` file that was run most recently. The "Bytecode" tab displays the decompiled bytecode of the most-recently-loaded file in a human-readable format; this is useful for debugging.

### Browser Compatibility

The UI requires [XMLHttpRequest v2][xhrv2] and the [DataView API][dataview]; this means that it will only run on very recent browsers: IE >= 10, or the latest Firefox or Chrome.

[xhrv2]: http://caniuse.com/#feat=xhr2
[dataview]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView