var dbManager = new TodoListDB();
dbManager.init().then(function () {
    dbManager.list().then(function (result) {
        todoList = result;
        populateCards(result);
    }, function (error) {
        VanillaToasts.create({
            title: 'Not able to list TODOs',
            text: error.target.error, // little text with error log
            type: 'error', // success, info, warning, error   / optional parameter
            timeout: 3000, // hide after 5000ms, // optional paremter
            callback: Function.prototype // executed when toast is clicked / optional parameter
        });
    });
});

function list() {

}

function get(id) {

}

function insert(todoJson) {

}

function update(todoJson) {

}

function clearAll() {
    dbManager.clearAll().then(function (result) {
        var container = document.querySelector('.card-container');
        container.innerHTML = "";
        VanillaToasts.create({
            title: 'Database cleared',
            text: "All records were successfully deleted", // little text with error log
            type: 'info', // success, info, warning, error   / optional parameter
            timeout: 3000, // hide after 5000ms, // optional paremter
            callback: Function.prototype // executed when toast is clicked / optional parameter
        });
    }).catch(function (error) {
        VanillaToasts.create({
            title: 'Not able to clear TODO database',
            text: error.target.error, // little text with error log
            type: 'error', // success, info, warning, error   / optional parameter
            timeout: 3000, // hide after 5000ms, // optional paremter
            callback: Function.prototype // executed when toast is clicked / optional parameter
        });
    });
}


self.addEventListener('message', function (e) {
    var data = e.data;

    switch (data.cmd) {
        case 'list':
            break;
        case 'stop':

            self.close(); // Terminates the worker.
            break;
        default:
            self.postMessage('Unknown command: ' + data.msg);
    }

}, false);
