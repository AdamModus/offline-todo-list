'use strict';

function generateCardHTML(todoJson) {

  let newCard = new ToDoCardElement();
  newCard.className = "card";
  newCard.setAttribute('identifier', todoJson.id);
  newCard.setAttribute('text', todoJson.text);
  newCard.setAttribute('header', todoJson.name);
  newCard.setAttribute('footer', todoJson.email);

  return newCard;
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