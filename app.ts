
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

function parse(data: ArrayBuffer) {
  var out = document.getElementById("outputbox")
  try {
    out.setAttribute("class", "")
    out.textContent = JSON.stringify(parser.parse(data), null, 2)
  } catch (err) {
    displayError(err)
  }
 
}
function displayError(err: any) {
  var out = document.getElementById("outputbox")
  out.setAttribute("class", "error")
  out.textContent = "PARSE FAILED\n\n" + err.toString() + (err.stack ?
    "\n\n" + err.stack.toString() : "")
}

function loadFileWithAjax(filename: string) {
  console.log("Loading binary data from " + filename + "...")
  var xhr = new XMLHttpRequest()
  xhr.open('GET', filename, true)
  xhr.responseType = 'arraybuffer'
  xhr.onerror = function(e) {displayError(e.error)}
  xhr.onload = function(e) {
    if (this.status < 400) {
      parse(this.response)
    } else {
      displayError("HTTP Error " + this.status + ": " + this.statusText)
    }
  }
  xhr.send()
}

window.onload = () => {
  var ul = document.getElementById("filelist")
  function addListItem(filename: string) {
    var li = document.createElement("li")
    li.textContent = filename
    li.onclick = (e) => loadFileWithAjax("pyc/" + filename)
    ul.appendChild(li)
  }
  for (var i = 0; i < builtinTestFiles.length; i++) {
    addListItem(builtinTestFiles[i])
  }
  document.getElementById("fileupload").onchange = function(e) {
    var files: FileList = this.files
    if (files && FileReader) {
      var reader = new FileReader()
      reader.onload = function() {parse(this.result)}
      reader.readAsArrayBuffer(files.item(0))
    } else {
      displayError("Your browser does not appear to support JS file uploading.")
    }
  }
}
