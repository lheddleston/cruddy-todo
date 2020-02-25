const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, id) => {
    var newFile = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(newFile, text, (err) => {
      if (err) {
        throw ('Error writting todo file: ', err);
      } else {
        callback(null, { id: id, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {
  var files = [];
  fs.readdir(exports.dataDir, null, (err, files) => {
    if (err) {
      callback(new Error('Cannot read files'));
    }
    files = files.map(file => {
      file = file.split('.')[0];
      files.push({ id: file, text: file });
    });
    callback(null, files);
  });
  // return files;
};

exports.readOne = (id, callback) => {
  var pathToFile = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(pathToFile, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log(pathToFile);
      callback(null, {id: id, text: text});
    }
  });
};

exports.update = (id, text, callback) => {
  var pathToFile = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(pathToFile, 'utf8', (err) =>{
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(pathToFile, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id: id, text: text });
        }
      });
    }
  });


};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
