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

function listCards(todos) {
  for (let todo of todos) {
    addCard(todo);
  }
}

function addCard(todo) {
  var parent = document.querySelector('.card-container');
  let child = generateCardHTML(todo);
  parent.appendChild(child);
}

function updateCard(todo) {
  // update card here
}

function deleteCard(id) {

}

function clearAllCards() {
  var container = document.querySelector('.card-container');
  container.classList.toggle('fade-out');
  setTimeout(() => {
    // waited for cards to have faded out
    container.innerHTML = "";
    container.classList.toggle('fade-out');
  }, 1000)
}

function createToast(params) {
  VanillaToasts.create(params);
}

///////////////////////////////////////////////////////
////////////// Assigning actions to UI ////////////////
///////////////////////////////////////////////////////
document.getElementById("CleanDB").onclick = function () {
  wworker.postMessage({
    cmd: wwCommands.clearAll
  });
};

document.getElementById("createTODO").onsubmit = function (evt) {
  evt.preventDefault();

  var form = document.getElementById('createTODO');
  var inputs = form.querySelectorAll('input[type="text"');
  var textAreas = form.querySelectorAll('textarea');
  var todoJson = {
    id: todoList[todoList.length - 1].id + 1,
    name: inputs[0].value,
    status: "TODO",
    text: textAreas[0].value,
    email: inputs[1].value,
    dateTime: (() => {
      var curr = new Date().toISOString().split('T');
      return curr[0] + ' ' + curr[1].substring(0, 8);
    })()
  };

  wworker.postMessage({
    cmd: wwCommands.insert,
    val: todoJson
  });

  // addTODO
  return false;
};