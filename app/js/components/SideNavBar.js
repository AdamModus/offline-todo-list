'use strict';

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
    id: todoList.length > 0 ? todoList[todoList.length - 1].id + 1 : 0,
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

function navBButtonPressedEvtHandler(evt) {
  evt.stopPropagation();
  showNav();
}

function closeFormHandler(evt) {
  var nav = document.getElementsByClassName('offline-nav')[0];

  switch (evt.type) {
    case 'click':
      if (!nav.contains(evt.target)) {
        hideNav();
      }
      break;
    case 'keydown':
      if (evt.keyCode == 27) { // escape key maps to keycode `27`
        hideNav();
      }
      break;
    default:
      break;
  }
}

function hideNav() {
  var nav = document.getElementsByClassName('offline-nav')[0];
  window.removeEventListener('click', closeFormHandler, false);
  window.removeEventListener('keydown', closeFormHandler, false);
  nav.classList.remove('open');
  nav.style.transform = '';
}

function showNav() {
  var nav = document.getElementsByClassName('offline-nav')[0];
  window.addEventListener('click', closeFormHandler, false);
  window.addEventListener('keydown', closeFormHandler, false);
  nav.classList.add('open');
}


function navTouchBehaviour() {
  var nav = document.getElementsByClassName('offline-nav')[0];
  var startX, currentX, touchingNav;

  nav.addEventListener('touchstart', onTouchStart);
  nav.addEventListener('touchmove', onTouchMove);
  nav.addEventListener('touchend', onTouchEnd);

  function onTouchStart(evt) {
    startX = evt.touches[0].pageX;
    currentX = startX;
    touchingNav = true;
    nav.style.transition = '0s';
    requestAnimationFrame(updatePos);
  }

  function onTouchMove(evt) {
    if (!touchingNav) {
      return;
    }

    currentX = evt.touches[0].pageX;
    var translateX = Math.min(0, currentX - startX);

    if (translateX < 0) {
      evt.preventDefault();
    }
  }

  function onTouchEnd() {
    if (!touchingNav) {
      return;
    }

    touchingNav = false;
    nav.style.transition = '0.5s ease-in-out';

    var translateX = Math.min(0, currentX - startX);
    if (translateX < 0) {
      hideNav();
    }
  }

  function updatePos() {
    if (!touchingNav) {
      return;
    }

    requestAnimationFrame(updatePos);

    var translateX = Math.min(0, currentX - startX);
    nav.style.transform = `translateX(${translateX}px)`;
  }
}

//just assigning stuff
document.getElementById("sideNavSwitch").onclick = navBButtonPressedEvtHandler;
navTouchBehaviour();
