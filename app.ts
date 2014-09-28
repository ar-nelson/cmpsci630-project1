
var filename = "pyc/example1.pyc"

window.onload = () => {
  var parser = new Python.Bin.Parser()
  console.log("Loading binary data from " + filename + "...")
  var xhr = new XMLHttpRequest()
  xhr.open('GET', filename, true)
  xhr.responseType = 'arraybuffer'

  xhr.onload = function (e) {
    console.dir(parser.parse(this.response))
  }

  xhr.send()
}
