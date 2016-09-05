"use strict";

let TodoListDB = (function () {
  const dbVersion = 2;
  // const schema = {
  //   id: "01",
  //   name: "Rafael",
  //   status: "TODO",
  //   text: "I need to do stuff bro!",
  //   email: "rafatexfr@gmail.com",
  //   dateTime: '05-03-1988'
  // };
  const indexes = [
    {
      'idxName': 'name',
      'attrName': 'name',
      'isUnique': false
    },
    {
      'idxName': 'email',
      'attrName': 'email',
      'isUnique': false
    }
  ];
  const idbLayer = Symbol('idbLayer');
  const storeName = Symbol('storeName'); // database name

  //used for logging
  const logTextColor = "white";
  const logBackgroundColor = "#1E90FF";

  // indexedDB.deleteDatabase("TODOListStore")

  class TodoListDB {
    constructor() {
      this[storeName] = "TODOListStore";
    }

    init() {
      var self = this;
      var openDBRequest = indexedDB.open(this[storeName], dbVersion);
      return new Promise(function (resolve, reject) {
        openDBRequest.onerror = function (event) {
          console.log('%c IndexedDB: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Why didn\'t you allow my web app to use IndexedDB?!');
          reject(event);
        };

        openDBRequest.onsuccess = function (event) {
          console.log('%c IndexedDB: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'You can now add stuff to the database.');
          self[idbLayer] = new IndexedDBLayer(event.target.result, self[storeName]);
          resolve(event);
        };

        // This event is only implemented in recent browsers
        openDBRequest.onupgradeneeded = function (event) {
          var db = event.target.result;

          db.onerror = function (event) {
            // Generic error handler for all errors targeted at this database's requests!
            console.log('%c IndexedDB: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Database error: ', event.target.errorCode);
            reject(event);
          };

          // Create an objectStore for this database. We're going to use "id" as our
          // key path because it's guaranteed to be unique.
          var todoStore = db.createObjectStore(self[storeName], {keyPath: "id"});


          // Create all the indexes
          // Careful the index name, attribute name and uniqueness
          for (let idx of indexes) {
            todoStore.createIndex(idx.idxName, idx.attrName, {unique: idx.isUnique});
          }

          // Use transaction oncomplete to make sure the objectStore creation is
          // finished before adding data into it.
          todoStore.transaction.oncomplete = function (event) {
            console.log('%c IndexedDB: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Transaction complete.');
            self[idbLayer] = new IndexedDBLayer(event.target.result, self[storeName]);
            resolve();
          };
        };
      });
    }

    list() {
      console.log('%c IndexedDB: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'List all TODO');
      return this[idbLayer].list();
    }


    getTodo(id) {
      console.log('%c IndexedDB: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Get TODO with id: ', id);
      return this[idbLayer].get(id);
    }


    addTodo(todoJson) {
      console.log('%c IndexedDB: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Adding a new TODO');
      return this[idbLayer].insert(todoJson);
    }


    updateTodo(todoJson) {
      console.log('%c IndexedDB: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Updating a TODO');
      return this[idbLayer].update(todoJson);
    }

    deleteTodo(id) {
      console.log('%c IndexedDB: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Delete TODO with id: ', id);
      return this[idbLayer].delete(id);
    }

    clearAll() {
      console.log('%c IndexedDB: ', 'color:' + logTextColor + '; background-color: ' + logBackgroundColor, 'Clear all :(');
      return this[idbLayer].clearAll();
    }
  }

  return TodoListDB;

})();


