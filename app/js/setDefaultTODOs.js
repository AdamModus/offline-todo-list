function setDefaultTODOs() {
    dbManager.clearAll().then(function () {
        var container = document.querySelector('.card-container');
        container.innerHTML = "";

        var p1 = dbManager.addTodo({
            id: 1,
            status: "TODO",
            name: "Momma Rex",
            email: "fabulousCretacious@mail.mad",
            text: "Walk the dinosaurs",
            dateTime: new Date()
        });

        var p2 = dbManager.addTodo({
            id: 2,
            status: "TODO",
            name: "Marvin, the Martian",
            email: "marvenous@marvel.mars",
            text: "Discover a new planet.",
            dateTime: new Date()
        });

        var p3 = dbManager.addTodo({
            id: 3,
            status: "TODO",
            name: "Some Hollywood guy, before LEGO the Movie happened",
            email: "sellYourBookAsAScript@holly.wood",
            text: "Write a book about the secret life of LEGO figures.",
            dateTime: new Date()
        });

        var p4 = dbManager.addTodo({
            id: 4,
            status: "TODO",
            name: "Pinky is my name!",
            email: "pinky@labrats.org",
            text: "Help my Brain in his world domination plan.",
            dateTime: new Date()
        });

        var p5 = dbManager.addTodo({
            id: 5,
            status: "TODO",
            name: "Random Frat Prankster Bro",
            email: "imSecretlyAstonKutcher@holly.wood",
            text: "Call a random person and tell them I can't talk right now.",
            dateTime: new Date()
        });

        var p6 = dbManager.addTodo({
            id: 6,
            status: "TODO",
            name: "Not Bill Gates",
            email: "stillNotBillGates@hotmail.com",
            text: "Fix all the bugs on Windows Vista",
            dateTime: new Date()
        });


        Promise.all(p1, p2, p3, p4, p5, p6).then(function () {
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