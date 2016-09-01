"use strict";

let IndexedDBLayer = (function () {
  const db = Symbol('db'); // Database reference
  const storeName = Symbol('storeName'); // database name
  const getObjectStore = Symbol('getObjectStore'); // this will be a private function
  const readOnly = "readonly";
  const readWrite = "readwrite";

  class IndexedDBLayer {
    constructor(dbRef, storeNameParam) {

      this[db] = dbRef;
      this[storeName] = storeNameParam;

      this[getObjectStore] = function (mode) {
        return this[db].transaction([this[storeName]], mode).objectStore(this[storeName]);
      }
    }

    // API functions

    list() {
      var objectStore = this[getObjectStore](readOnly);

      return new Promise(function (resolve, reject) {
        var listRequest = objectStore.getAll();
        listRequest.onerror = function (event) {
          // Handle errors!
          reject(event);
        };

        listRequest.onsuccess = function (event) {
          // Do something with the request.result!
          resolve(listRequest.result);
        };
      });
    }


    get(id) {
      var objectStore = this[getObjectStore](readOnly);

      return new Promise(function (resolve, reject) {
        var getRequest = objectStore.get(id);

        getRequest.onerror = function (event) {
          // Handle errors!
          reject(event);
        };

        getRequest.onsuccess = function (event) {
          // Do something with the request.result!
          resolve(getRequest.result);
        };
      });
    }


    insert(todoJson) {
      var objectStore = this[getObjectStore](readWrite);

      return new Promise(function (resolve, reject) {
        var addRequest = objectStore.add(todoJson);

        addRequest.onerror = function (event) {
          // Handle errors!
          reject(event);
        };

        addRequest.onsuccess = function (event) {
          // Do something with the request.result!
          resolve(addRequest.result);
        };
      });
    }


    update(todoJson) {
      var objectStore = this[getObjectStore](readWrite);

      return new Promise(function (resolve, reject) {
        var updateRequest = objectStore.put(todoJson);

        updateRequest.onerror = function (event) {
          // Handle errors!
          reject(event);
        };

        updateRequest.onsuccess = function (event) {
          // Success - the data is updated!
          resolve(updateRequest.result);
        };
      });
    }

    delete(id) {
      var objectStore = this[getObjectStore](readWrite);

      return new Promise(function (resolve, reject) {
        var deleteRequest = objectStore.delete(id);

        deleteRequest.onerror = function (event) {
          // Handle errors!
          reject(event);
        };

        deleteRequest.onsuccess = function (event) {
          // Success - the data is deleted!
          resolve(deleteRequest.result);
        };
      });
    }

    clearAll() {
      var objectStore = this[getObjectStore](readWrite);

      return new Promise(function (resolve, reject) {
        var clearRequest = objectStore.clear();

        clearRequest.onerror = function (event) {
          // Handle errors!
          reject(event);
        };

        clearRequest.onsuccess = function (event) {
          // Success - everything was deleted!
          resolve(clearRequest.result);
        };
      });
    }

  }

  return IndexedDBLayer;
}());