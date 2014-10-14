
var builtinTestFiles = [
  "Basicmath.pyc",
  "Basicoperations.pyc",
  "complexmath.pyc",
  "example1.pyc",
  "functions.pyc",
  "ifwithcomparisons.pyc",
  "kwargs.pyc",
  "listcomprehensions.pyc",
  "listsdictionariestuples.pyc",
  "Logicalop.pyc",
  "module1.pyc",
  "module2.pyc",
  "nestedfor.pyc",
  "simplefor.pyc",
  "stringmanipulation.pyc",
  "usingmodules.pyc",
  "while.pyc"
]

var parser = new Python.Bin.Parser()
var currentOutput: HTMLElement

window.onload = () => {
  var filelist = document.getElementById("filelist")
  var fileupload = document.getElementById("fileupload")
  var outputtab = document.getElementById("outputtab")
  var bytecodetab = document.getElementById("bytecodetab")
  var outputbox = document.getElementById("outputbox")
  var bytecodebox = document.getElementById("bytecodebox")

  function clearOutput() {
    bytecodebox.classList.remove("error")
    while (outputbox.hasChildNodes()) outputbox.removeChild(outputbox.firstChild)
    currentOutput = document.createElement("samp")
    currentOutput.classList.add("stdout")
    outputbox.appendChild(currentOutput)
  }

  function printSpecialOutput(output: string, cls: string) {
    currentOutput = document.createElement("samp")
    currentOutput.classList.add(cls)
    currentOutput.textContent = output
    outputbox.appendChild(currentOutput)
    currentOutput = document.createElement("samp")
    currentOutput.classList.add("stdout")
    outputbox.appendChild(currentOutput)
  }

  function displayParseError(err: any) {
    var errString = "PARSE FAILED\n\n" + err.toString() + (err.stack ?
      "\n\n" + err.stack.toString() : "")
    bytecodebox.classList.add("error")
    bytecodebox.textContent = errString
    printSpecialOutput(errString, "error")
  }

  function parse(data: ArrayBuffer) {
    clearOutput()
    try {
      var codeObject = parser.parse(data)
      bytecodebox.textContent = Python.Bin.stringifyCodeObject(codeObject)
    } catch (err) {
      displayParseError(err)
      return
    }
    try {
      printSpecialOutput("Loaded " + JSON.stringify(codeObject.name) + ".", "info")
      var interpreter = new Python.Interpreter(codeObject)
      interpreter.exec()
      printSpecialOutput("Execution complete.", "info")
    } catch (err) {
      var errString = "INTERPRETER ERROR\n\n" + err.toString() + (err.stack ?
        "\n\n" + err.stack.toString() : "")
      printSpecialOutput(errString, "error")
    }
  }

  function loadFileWithAjax(filename: string) {
    console.log("Loading binary data from " + filename + "...")
    var xhr = new XMLHttpRequest()
    xhr.open('GET', filename, true)
    xhr.responseType = 'arraybuffer'
    xhr.onerror = function (e) { displayParseError(e.error) }
    xhr.onload = function (e) {
      if (this.status < 400) {
        parse(this.response)
      } else {
        displayParseError("HTTP Error " + this.status + ": " + this.statusText)
      }
    }
    xhr.send()
  }

  function addListItem(filename: string) {
    var li = document.createElement("li")
    li.textContent = filename
    li.onclick = (e) => loadFileWithAjax("pyc/" + filename)
    filelist.appendChild(li)
  }

  for (var i = 0; i < builtinTestFiles.length; i++) {
    addListItem(builtinTestFiles[i])
  }

  fileupload.onchange = function(e) {
    var files: FileList = this.files
    if (files && FileReader) {
      var reader = new FileReader()
      reader.onload = function() {parse(this.result)}
      reader.readAsArrayBuffer(files.item(0))
    } else {
      displayParseError("Your browser does not appear to support JS file uploading.")
    }
  }

  outputtab.onclick = function (e) {
    bytecodetab.classList.remove("selectedtab")
    outputtab.classList.add("selectedtab")
    bytecodebox.classList.add("hidden")
    outputbox.classList.remove("hidden")
  }

  bytecodetab.onclick = function (e) {
    bytecodetab.classList.add("selectedtab")
    outputtab.classList.remove("selectedtab")
    bytecodebox.classList.remove("hidden")
    outputbox.classList.add("hidden")
  }
}
