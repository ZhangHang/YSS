var fs = require('fs')

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

var pathToLookup = process.argv[2]
var pageIndex = (function(){
  var segments = pathToLookup.split('/')
  return segments[segments.length - 1]
})()

function printCSS(names) {
  var css = ""
  names.forEach(function(name){
    css += "#page-" + pageIndex + " #" + rawName(name) + "{\n"
    css += "  background-image: url(../images/"+ pageIndex + "/"+ name + ");\n"
    css += "}"
  })
  return css
}


function printHTML(names) {
  var html = ""
  names.forEach(function(name){
    html += "<div id='"+ rawName(name) + "' class='fs'></div>\n"
  })
  return html
}


function rawName(nameWithExtension){
  return nameWithExtension.split('.')[0];
}


var fileNameFromPath = getFiles(pathToLookup).map(function(path){
    var segments = path.split('/')
    return segments[segments.length - 1]
})

console.log(printHTML(fileNameFromPath))
console.log(printCSS(fileNameFromPath))
