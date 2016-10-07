"use strict";

/**
 * Toast settings
 */
// Default time before the toast fades away
const vtTimeout = 2 * 1000;
const vtCallback = Function.prototype;
// Different types of toast notifications
const vtType = {
  error: "error",
  warning: 'warning',
  info: "info",
  success: "success"
};

/**
 * List of different commands for the web worker
 */
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

function createToast(params) {
  VanillaToasts.create(params);
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

/*
 Observe connectivity changes
 */
// Feature detection
if ('ononline' in window && 'onoffline' in window && typeof navigator.onLine === 'boolean') {
  var networkConnectivityService = new NetworkConnectivityService();
  var connectivityIndicatorElement = document.getElementById('connectivity-indicator');

  /**
   * Function to inform the user the connectivity change
   *
   * @param connectivityState
   */
  var connectivityNotifier = function logConnectivity(connectivityState, notifyUser) {
    if (connectivityState === 'online') {
      console.log('%c Connectivity: ', 'color:#000; background-color: orange', 'online :)');
      connectivityIndicatorElement.className = 'connectivity-online';
      if (notifyUser) {
        createToast({
          title: "Looks like you're online again! (~˘▾˘)~",
          text: "Your connectivity was restored. Thank god! Websites should work normally again.",
          type: vtType.success,
          timeout: 5 * 1000
        });
      }
    } else {
      console.log('%c Connectivity: ', 'color:#000; background-color: orange', 'offline :(');
      connectivityIndicatorElement.className = 'connectivity-offline';
      if (notifyUser) {
        createToast({
          title: "Oh, you got offline! (ಥ﹏ಥ)",
          text: "I'm sorry for your soul, websites might still work but with limited functionality.",
          type: vtType.warning,
          timeout: 5 * 1000
        });
      }
    }
  };

  // Init the connectivity state
  connectivityNotifier(networkConnectivityService.getCurrentConnectivity(), false);

  // Observe connectivity changes
  networkConnectivityService.onConnectivityChange(function (state) {
    connectivityNotifier(state, true);
  });
}
