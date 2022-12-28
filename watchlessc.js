#!/usr/bin/env node
const { wSender } = require('./utils')

var os = require('os');

var fs = require('fs');

var path = require('path');

var colors = require('colors');

var chokidar = require('chokidar');//watch files

var mkdirp = require('mkdirp');

colors.setTheme({
  error : 'red',
  success : 'green',
  info : 'yellow'
});

var exec = require('child_process').exec;

var argv = require("minimist")(process.argv.slice(2), {
  alias: {
    'target': 't',
    'directory': 'd'
  },
  string: ['target','directory'],
  'default': {
    'directory': process.cwd()
  }
});

if (argv.help) {
  console.log("Usage:".info);
  console.log("  watchlessc --help            // print help information".success);
  console.log("  watchlessc                   // watch current dir and output to current ".success);
  console.log("  watchlessc -d /home/less     // watch a special director".success);
  console.log("  watchlessc -t /home/less     // target directory ".success);
  process.exit(0);
}

if(argv.directory && fs.existsSync(argv.directory)){

  argv.target = argv.target || argv.directory;

  var watcherIns = chokidar.watch(argv.directory,{
    persistent : true
  });
  
  console.log(('start watch file on '+argv.directory+'').success);
  watcherIns.on('change',function(filePath){
    var ext = path.extname(filePath);
    if(ext.toLowerCase() == '.less' ){
      var targetPath = '';
      if(argv.directory != argv.target){
        var noextname = path.basename(filePath,path.extname(filePath));
        var leave = filePath.replace(path.normalize(argv.directory),'');
        var abspath = path.join(argv.target,leave);
        var absparent = path.dirname(abspath);
        targetPath = path.join(absparent,noextname+'.css');
      }else{
        targetPath = filePath.substring(0,filePath.lastIndexOf('.'))+'.css';
      }
      var targetFolder = path.dirname(targetPath);
      if(!fs.existsSync(targetFolder)){
        mkdirp(targetFolder,function(){
          complier(filePath,targetPath);
        })
      }else{
        complier(filePath,targetPath);
      }
    }
  });
  
}else{
  console.log('directory is not exists...'.error);
  process.exit(0);
}

function complier (src,target){
  exec('lessc '+src+' > '+target,{encoding:'binary'},function(err,stdout,stderr){
    if(err){
      throw err;
    }
    console.log('compile file : '+src.info+' to '+target.success+' successed!');
    const port = argv.p
    if (port) {
      wSender(port)
    }
    console.log('waiting for changes...');
  });
}