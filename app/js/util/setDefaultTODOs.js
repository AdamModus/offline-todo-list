'use strict';

function setDefaultTODOs() {
  wworker.postMessage({
    cmd: "clearAll"
  });

  setTimeout(() => {
    var container = document.querySelector('.card-container');
    container.innerHTML = "";

    var todos = [
      {
        id: 1,
        status: "TODO",
        name: "Momma Rex",
        email: "fabulousCretacious@mail.mad",
        text: "Walk the dinosaurs",
        dateTime: new Date()
      }, {
        id: 2,
        status: "TODO",
        name: "Marvin, the Martian",
        email: "marvenous@marvel.mars",
        text: "Discover a new planet.",
        dateTime: new Date()
      }, {
        id: 3,
        status: "TODO",
        name: "Some Hollywood guy, before LEGO the Movie happened",
        email: "sellYourBookAsAScript@holly.wood",
        text: "Write a book about the secret life of LEGO figures.",
        dateTime: new Date()
      }, {
        id: 4,
        status: "TODO",
        name: "Pinky is my name!",
        email: "pinky@labrats.org",
        text: "Help my Brain in his world domination plan.",
        dateTime: new Date()
      }, {
        id: 5,
        status: "TODO",
        name: "Random Frat Prankster Bro",
        email: "imSecretlyAstonKutcher@holly.wood",
        text: "Call a random person and tell them I can't talk right now.",
        dateTime: new Date()
      }, {
        id: 6,
        status: "TODO",
        name: "Not Bill Gates",
        email: "stillNotBillGates@hotmail.com",
        text: "Fix all the bugs on Windows Vista",
        dateTime: new Date()
      }
    ];

    for (let todo of todos) {
      wworker.postMessage({
        cmd: 'insert',
        val: todo
      });
    }

  }, 1000);

}