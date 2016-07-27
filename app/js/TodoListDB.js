let TodoListDB = (function () {
    const dbVersion = 2;
    const schema = {
        id: "01",
        name: "Rafael",
        status: "TODO",
        text: "I need to do stuff bro!",
        email: "rafatexfr@gmail.com",
        dateTime: '05-03-1988'
    };
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

    // indexedDB.deleteDatabase("TODOListStore")

    class TodoListDB {
        constructor() {
            this[storeName] = "TODOListStore";
        }

        init() {
            var self = this;
            var openDBRequest = window.indexedDB.open(this[storeName], dbVersion);
            return new Promise(function (resolve, reject) {
                openDBRequest.onerror = function (event) {
                    console.log("Why didn't you allow my web app to use IndexedDB?!");
                    reject(event);
                };

                openDBRequest.onsuccess = function (event) {
                    console.log('You can now add stuff to the database');
                    self[idbLayer] = new IndexedDBLayer(event.target.result, self[storeName]);
                    resolve(event);
                };

                // This event is only implemented in recent browsers
                openDBRequest.onupgradeneeded = function (event) {
                    var db = event.target.result;

                    db.onerror = function (event) {
                        // Generic error handler for all errors targeted at this database's requests!
                        console.log("Database error: " + event.target.errorCode);
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
                        console.log('You can now add stuff to the database');
                        self[idbLayer] = new IndexedDBLayer(event.target.result, self[storeName]);
                        resolve();
                    };
                };
            });
        }

        list() {
            return this[idbLayer].list();
        }


        getTodo(id) {
            return this[idbLayer].get(id);
        }


        addTodo(todoJson) {
            return this[idbLayer].insert(todoJson);
        }


        updateTodo(todoJson) {
            return this[idbLayer].update(todoJson);
        }

        deleteTodo(id) {
            return this[idbLayer].delete(id);
        }

        clearAll() {
            return this[idbLayer].clearAll();
        }
    }

    return TodoListDB;

})();


