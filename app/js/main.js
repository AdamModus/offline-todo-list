var todoList = [];

function generateCardHTML(todoJson) {
    var elem = document.createElement('div');
    elem.className = "card";
    elem.innerHTML = `
                        <ul>
                            <li>ID: ${todoJson.id}</li>
                            <li>STATUS: ${todoJson.status}</li>
                            <li>NAME: ${todoJson.name}</li>
                            <li>EMAIL: ${todoJson.email}</li>
                            <li>TEXT: ${todoJson.text}</li>
                            <li>DATETIME: ${todoJson.dateTime}</li>
                        </ul>
                    `;

    return elem;
}


function populateCards(todos) {
    for (let todo of todos) {
        addCard(todo);
    }
    new Cards();
}


function addCard(todo) {
    var parent = document.querySelector('.card-container');
    let child = generateCardHTML(todo);
    parent.appendChild(child);
}


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


document.getElementById("CleanDB").onclick = function () {
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
};

document.getElementById("createTODO").onsubmit = function (evt) {
    evt.preventDefault();

    var form = document.getElementById('createTODO');
    var inputs = form.querySelectorAll('input[type="text"');
    var todoJson = {
        id: todoList.length,
        name: inputs[0].value,
        status: "TODO",
        text: inputs[1].value,
        email: inputs[2].value,
        dateTime: (() => {
            var curr = new Date().toISOString().split('T');
            return curr[0] + ' ' + curr[1].substring(0, 8);
        })()
    };

    dbManager.addTodo(todoJson).then(function (result) {
        addCard(todoJson);
        todoList.push(todoJson);
    }).catch(function (error) {
        VanillaToasts.create({
            title: 'TODO not added',
            text: error.target.error, // little text with error log
            type: 'error', // success, info, warning, error   / optional parameter
            timeout: 3000, // hide after 5000ms, // optional paremeter
            callback: Function.prototype // executed when toast is clicked / optional parameter
        });
    });

    return false;
};