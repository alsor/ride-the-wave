var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;


var MessagesStore = function() {
  var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
  var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

  console.log("Connecting to " + host + ":" + port);

  this.db = new Db('ride-the-wave', new Server(host, port, {}));
}

MessagesStore.prototype.insert_message = function(message, callback) {
  this.db.open(function(error, db) {
    if (error) throw error;

    db.collection('messages', function(err, collection) {
      collection.insert({'body': message}, function(docs) {
        db.close();
        callback(docs);
      });
    });
  });
}

// fetch messages
MessagesStore.prototype.messages = function(callback) {
  this.db.open(function(err, db) {
    if (err) throw err;

    db.collection('messages', function(err, collection) {
      collection.find({}, function(err, cursor) {
        cursor.toArray(function(err, messages) {
          db.close();
          callback(messages);
        });
      });
    });
  });
}

exports['MessagesStore'] = MessagesStore;
