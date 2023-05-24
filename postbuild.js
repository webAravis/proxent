console.log('post build in progress');

const indexFile = './dist/proxent/index.html';
let fs = require('fs');
fs.readFile(indexFile, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  let result = data.replace('<base href="./">', '<script>document.write(\'<base href="\' + document.location + \'" />\');</script>');
  result = result.replaceAll(' type="module"', '');

  fs.writeFile(indexFile, result, 'utf8', function (err) {
    if (err) return console.log(err);

    var pjson = require('./package.json');
    console.log(pjson.version);

    console.log('compressing full version');
    var zipper = require('zip-local');
    zipper.sync.zip("./dist/proxent").compress().save("./dist/proxent_"+pjson.version+"_full.zip");

    console.log('extracting legacy mod');
    zipper.sync.zip("./dist/proxent/assets/mods/legacy").compress().save("./dist/mod_proxent_legacy_"+pjson.version+".zip");

    console.log('removing mods');
    let rimrafSync = require("rimraf");
    rimrafSync("./dist/proxent/assets/mods/legacy", () => {
      console.log("done removing medias");

      console.log('compressing light version');
      zipper.sync.zip("./dist/proxent").compress().save("./dist/proxent_"+pjson.version+"_light.zip");
    });
  });

});

console.log('post build done');
