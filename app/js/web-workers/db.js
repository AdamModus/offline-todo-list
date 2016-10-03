"use strict";

const logTextColor = "#000";
const logBackgroundColor = "#33cc33";

try {
  self.importScripts("../indexedDB/IndexedDBLayer.js", "../indexedDB/TodoListDB.js");
  console.log("%c WebWorker: ", "color: " + logTextColor + "; background-color: " + logBackgroundColor, "IndexedDB related scripts were imported successfully");
} catch (err) {
  console.log("%c WebWorker: ", "color: " + logTextColor + "; background-color: " + logBackgroundColor, "IndexedDB related scripts were imported successfully");
}

var dbReady = false;
var dbManager = new TodoListDB();
dbManager.init().then(function () {
  dbReady = true;
  list();
});

function list() {
  dbManager.list().then(function (result) {
    sendSuccess({
      cmd: "list",
      result: result
    });
  }, function (error) {
    sendError({
      title: "Not able to list TODOs",
      text: "There was a problem listing all TODOs \n" + error.target.error
    });
  });
}

function get(id) {
  dbManager.getTodo(id).then(function (result) {
    sendSuccess({
      cmd: "get",
      result: result
    });
  }, function (error) {
    sendError({
      title: "Not able to get TODO",
      text: "There was an exception while getting the TODO with id:" + id + "\n" + error.target.error
    });
  });
}

function insert(todoJson) {
  dbManager.addTodo(todoJson).then(function (result) {
    sendSuccess({
      cmd: "insert",
      result: todoJson
    });
  }).catch(function (error) {
    sendError({
      title: "Not able to add TODO",
      text: "There was an exception while inserting a TODO\n" + error.target.error
    });
  });
}

function update(todoJson) {
  dbManager.addTodo(todoJson).then(function (result) {
    sendSuccess({
      cmd: "update",
      result: todoJson
    });
  }).catch(function (error) {
    sendError({
      title: "Not able to add TODO",
      text: "There was an exception while updating the TODO with id:" + id + "\n" + error.target.error
    });
  });
}

function remove(id) {
  dbManager.deleteTodo(id).then(function () {
    sendSuccess({
      cmd: "delete",
      result: id
    });
  }, function (error) {
    sendError({
      title: "Not able to delete the TODO",
      text: "There was an exception while deleting the TODO with id:" + id + "\n" + error.target.error
    });
  });
}

function clearAll() {
  dbManager.clearAll().then(function (result) {
    sendSuccess({
      cmd: "clearAll",
      result: result
    });
  }).catch(function (error) {
    sendError({
      title: 'Not able to clear TODO database',
      text: error.target.error, // little text with error log
    });
  });
}

function sendError(errorParams) {
  self.postMessage({
    cmd: "error",
    val: {
      title: errorParams.title,
      text: errorParams.text,
    }
  });
}

function sendSuccess(pmParams) {
  self.postMessage({
    cmd: "success",
    val: {
      cmd: pmParams.cmd,
      result: pmParams.result
    }
  });
}

function filterAction(data) {
  if (!dbReady) {
    setTimeout(function () {
      filterAction(data)
    }, 50);
    return;
  }

  switch (data.cmd) {
    case 'list':
      list();
      break;
    case 'get':
      get(data.val);
      break;
    case 'insert':
      insert(data.val);
      break;
    case 'update':
      update(data.val);
      break;
    case 'delete':
      remove(data.val);
      break;
    case 'clearAll':
      clearAll();
      break;
    case 'close':
      self.close(); // Terminates the worker.
      break;
    default:
      sendError({
        title: "Unknown command",
        text: "There was some strange mistake. An unknown command was sent and we don't know what to do about it"
      });
  }
}

self.addEventListener('message', function (e) {
  var data = e.data;
  filterAction(data);
}, false);
