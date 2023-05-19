console.log('post build in progress');

const indexFile = './dist/proxent/index.html';
let fs = require('fs');
fs.readFile(indexFile, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  let result = data.replace('<base href="./">', '<script>document.write(\'<base href="\' + document.location + \'" />\');</script>');
  result = result.replace(' type="module"', '');

  fs.writeFile(indexFile, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });

});

var zipper = require('zip-local');
zipper.sync.zip("./dist/proxent").compress().save("./dist/full.zip");

let rimraf = require("rimraf");
rimraf("./dist/proxent/assets/medias", function () { console.log("done removing medias"); });

zipper.sync.zip("./dist/proxent").compress().save("./dist/light.zip");

console.log('post build done');
