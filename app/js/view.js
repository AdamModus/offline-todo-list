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
    var cards = new Cards();
    cards.onCardDelete = function (index) {
        console.log('you killed me, why ?', index);
    }
}

function addCard(todo) {
    var parent = document.querySelector('.card-container');
    let child = generateCardHTML(todo);
    parent.appendChild(child);
}


function createToast(params) {
    VanillaToasts.create(params);
}