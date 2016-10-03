"use strict";

const vtTimeout = 3000;
const vtCallback = Function.prototype;
const vtType = {
  error: "error",
  info: "info",
  success: "success"
};
const wwCommands = {
  list: 'list',
  get: 'get',
  insert: 'insert',
  update: 'update',
  delete: 'delete',
  clearAll: 'clearAll',
  close: 'close'
};

var todoList = [];
var cardsClass;
var wworker = new Worker('js/web-workers/db.js');

wworker.onmessage = function (e) {
  var data = e.data;
  switch (data.cmd) {
    case "success":
      filterAction(data.val);
      break;
    case "error":
      createToast({
        title: data.val.title,
        text: data.val.text,
        type: vtType.error,
        timeout: vtTimeout,
        callback: vtCallback
      });
      break;
    default:
      createToast({
        title: "Unknown command",
        text: "There was some strange mistake. An unknown command was sent and we don't know what to do about it", // little text with error log
        type: vtType.error, // success, info, warning, error   / optional parameter
        timeout: vtTimeout, // hide after 5000ms, // optional parameter
        callback: vtCallback // executed when toast is clicked / optional parameter
      });
  }
};

function filterAction(data) {
  switch (data.cmd) {
    case 'list':
      listAction(data.result);
      break;
    case 'get':
      getAction(data.result.id);
      break;
    case 'insert':
      insertAction(data.result);
      break;
    case 'update':
      updateAction(data.result.id);
      break;
    case 'delete':
      deleteAction(data.result);
      break;
    case 'clearAll':
      clearAllAction();
      break;
    case 'close':
      closeAction();
      break;
    default:
      createToast({
        title: "Unknown command",
        text: "There was some strange mistake. An unknown command was sent and we don't know what to do about it", // little text with error log
        type: vtType.error, // success, info, warning, error   / optional parameter
        timeout: vtTimeout, // hide after 5000ms, // optional parameter
        callback: vtCallback // executed when toast is clicked / optional parameter
      });
  }
}

function reportSuccess(params) {
  createToast({
    title: params.title,
    text: params.text,
    type: vtType.success,
    timeout: vtTimeout,
    callback: vtCallback
  });
}

function initCards() {
  cardsClass = new Cards();
  cardsClass.onCardDelete = function (elem) {
    let id = elem.getAttribute('identifier');
    wworker.postMessage({
      cmd: wwCommands.delete,
      val: parseInt(id)
    });
  }
}

///////////////////////////////////////////////////////
////////////// Actions ////////////////
///////////////////////////////////////////////////////

function listAction(todos) {
  todoList = todos.slice(0);
  listCards(todos);
  reportSuccess({
    title: "Listing all TODOs",
    text: "The TODO list with all TODO elements should be visible now"
  });
  initCards();
}

function getAction(todoId) {
  reportSuccess({
    title: "Retrieved a TODO",
    text: "Retrieved a specific TODO with id:" + todoId
  });
}

function insertAction(todoJson) {
  addCard(todoJson);
  todoList.push(todoJson);
  reportSuccess({
    title: "Inserting a TODO",
    text: "The TODO was successfully created"
  });
}

function updateAction(todoId) {
  reportSuccess({
    title: "Updated a TODO",
    text: "The TODO with the id:" + todoId + " was successfully updated"
  });
}

function deleteAction(todoId) {
  let deletedIdx = todoList.findIndex((elem) => {
    return elem.id == todoId
  });
  todoList.splice(deletedIdx, 1);

  reportSuccess({
    title: "Deleted a TODO",
    text: "Deleted the TODO with id:" + todoId
  });
}

function clearAllAction() {
  clearAllCards();
  reportSuccess({
    title: "Deleted all TODOs",
    text: "All TODOs were successfully deleted"
  });
}

function closeAction() {
  wworker.terminate(); // Terminates the worker
  createToast({
    title: "Web Worker terminated",
    text: "The Web Worker was terminated. It's not working anymore Scotty!!",
    type: vtType.info,
    timeout: vtTimeout,
    callback: vtCallback
  });
}
