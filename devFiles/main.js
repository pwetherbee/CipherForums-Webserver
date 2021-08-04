"use strict";
// SHA256 A STRING
// ------------------------------------------------------------------------------------------------------------------------

import {
  sha256,
  ascii_to_hexa,
  hex_to_dec,
  hex_to_text,
  dec_to_hex,
} from "./helpers/convert";

//Implement generating comment page
let myStorage = window.localStorage;
let commentContainer = document.querySelector(".comments");
let forumButtons = document.querySelectorAll(".select");
let hideBtn = document.querySelector(".btn__hide");
let keyInput = document.querySelector(".key__textbox");

hideBtn.addEventListener("click", () => {
  keyInput.type = keyInput.type === "text" ? "password" : "text";
});

let thread1 = [
  "7f741c422a0a640a08312043405371345970035e2d7442435b090b444375767e5c717d536444705c473a086a67077b744336480c534411535352530a0204034b",
  "5d7c2049170f51371c2532784072543c6a542f7a2e44514d5c450e504152185b40175712535d5f5f520c111e1118584547415e004c4d425b471708594b4a4f4b",
  "5b4402771d2d5f01092e3b545b7775015d6232431e597e6c6327104645524d4e50585b5f555c4612540d085f540f4310560e590c5359161257580f55545e424b",
];

let thread2 = [
  "7c67096225377e162f0d00506179590a4859306d3d4b405b750f306d50644d7e7962415c614e5a574e42005c52134e4041085b0f165e11125656065c5043454b",
  "5a7928680b0c61252309104d787d4e3d465e1a5d0550555c52451150135559515847445d5740535f5a070112430453545c151841525207481459174c4211164b",
  "6e5a0d62022c6e24102608415a485c12454e1250174c14575c080b505d43185a56455313105c5d465f0b0b5511155810590e5b0a165616125d1711594811164b",
  "407b294a0211520526061d5f57495745445a0f4644555147400401501340594113525851424b42465206454558155f104109514152520453415b16675a554f4b",
];

let thread3 = [
  "636712702b1044250e0e1444745b5d27537c0c643c7d7b505b19145a505c18535d5316405f5e5e125c0700424241455f560a5d0f16560c5614450d545d59584b",
  "535f127d02046300370f137c4476440d515a075d05185b5c1308075b1343505b40175f4110531251580f08575f151b10420e410d521016124d56424b5049094b",
  "67660e743e3b6011130f16707a695233576808573c6b415c46152f614073794e43564453545d4a120a42115a5812175946415a0e4217031257580f55545e424b",
];

let forums = [thread1, thread2, thread3];

let hexComments = [];

forums.forEach((convo, i) => {
  myStorage.setItem(`convo${i + 1}`, JSON.stringify(convo));
});

let myClasses = document.getElementsByClassName("formatHex");

function changeForum(id) {
  hexComments = JSON.parse(myStorage.getItem(`convo${id}`));
  updateBox();
}

forumButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let i = btn.getAttribute("data-index");
    changeForum(i);
  });
});

changeForum(2);

renderComments(hexComments);

function renderComment(comment) {
  commentContainer.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="insideForum">
    <p class="formatHex">
        ${comment}
    </p>
  </div>
  `
  );
  myClasses = document.getElementsByClassName("formatHex");
}

function renderComments(comms) {
  comms.forEach(renderComment);
}

for (var i = 0; i < myClasses.length; i++) {
  console.log(myClasses[i].textContent);
}

function keyXOR(key) {
  return hex_to_dec(ascii_to_hexa(sha256(key)));
}

function updateBox() {
  let keyText = keyInput.value;
  let keyDec = keyXOR(keyText);
  for (var i = 0; i < myClasses.length; i++) {
    const xOrd = BigInt(hex_to_dec(hexComments[i])) ^ BigInt(keyDec);
    let text = hex_to_text(dec_to_hex(xOrd));
    if (text.includes("|")) {
      text = text.split("|")[1];
    }
    myClasses[i].innerHTML = text;
  }
}

//Implement crazy hacker view

function crazy() {
  keyInput.value = dec_to_hex(600 * Math.random());
  updateBox();
}

let interval = setInterval(crazy, 20);

setTimeout(() => {
  clearInterval(interval);
  keyInput.value = "default_key";
  updateBox();
}, 500);

// keyInput.addEventListener("keypress", (e) => {
//   console.log(e.key);
//   if (e.key === "Enter") {
//     updateBox();
//   }
// });

keyInput.addEventListener("input", updateBox);

//Implement add comment
