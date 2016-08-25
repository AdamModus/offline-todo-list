const vtTimeout = 3000;
const vtCallback = Function.prototype;
const vtType = {
    error: "error",
    info: "info",
    success: "success"
};

var todoList = [];
var wworker = new Worker('js/wwdb.js');
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
            populateCards(data.result);
            reportSuccess({
                title: "Listing all TODOs",
                text: "The TODO list with all TODO elements should be visible now"
            });
            break;
        case 'get':
            reportSuccess({
                title: "Retrieved a TODO",
                text: "Retrieved a specific TODO with id:" + data.result.id
            });
            break;
        case 'insert':
            addCard(data.result);
            reportSuccess({
                title: "Inserting a TODO",
                text: "The TODO was successfully created"
            });
            break;
        case 'update':
            reportSuccess({
                title: "Updated a TODO",
                text: "The TODO with the id:" + data.result.id + " was successfully updated"
            });
            break;
        case 'delete':
            reportSuccess({
                title: "Deleted a TODO",
                text: "Deleted the TODO with id:" + data.result.id
            });
            break;
        case 'clearAll':
            reportSuccess({
                title: "Deleted all TODOs",
                text: "All TODOs were successfully deleted"
            });
            break;
        case 'close':
            wworker.terminate(); // Terminates the worker.
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


// Assigning actions to UI

document.getElementById("CleanDB").onclick = function () {
    wworker.postMessage({
        cmd: "clearAll"
    });
};

document.getElementById("createTODO").onsubmit = function (evt) {
    evt.preventDefault();

    var form = document.getElementById('createTODO');
    var inputs = form.querySelectorAll('input[type="text"');
    var textareas = form.querySelectorAll('textarea');
    var todoJson = {
        id: todoList.length,
        name: inputs[0].value,
        status: "TODO",
        text: textareas[0].value,
        email: inputs[1].value,
        dateTime: (() => {
            var curr = new Date().toISOString().split('T');
            return curr[0] + ' ' + curr[1].substring(0, 8);
        })()
    };

    // addTODO
    return false;
};