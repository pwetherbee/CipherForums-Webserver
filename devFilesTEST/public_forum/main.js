"use strict";
// SHA256 A STRING
// ------------------------------------------------------------------------------------------------------------------------

var sha256 = function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = "length";
  var i, j; // Used as a counter across the whole file
  var result = "";

  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8;

  //* caching results is optional - remove/add slash from front of this line to toggle
  // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
  // (we actually calculate the first 64, but extra values are just ignored)
  var hash = (sha256.h = sha256.h || []);
  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
  var k = (sha256.k = sha256.k || []);
  var primeCounter = k[lengthProperty];
  /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += "\x80"; // Append Ƈ' bit (plus zero padding)
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00"; // More zero padding
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return; // ASCII check: only accept characters in range 0-255
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  // process each chunk
  for (j = 0; j < words[lengthProperty]; ) {
    var w = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
    var oldHash = hash;
    // This is now the undefinedworking hash", often labelled as variables a...g
    // (we have to truncate as well, otherwise extra entries at the end accumulate
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      var i2 = i + j;
      // Expand the message into 64 words
      // Used below if
      var w15 = w[i - 15],
        w2 = w[i - 2];

      // Iterate
      var a = hash[0],
        e = hash[4];
      var temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
        ((e & hash[5]) ^ (~e & hash[6])) + // ch
        k[i] +
        // Expand the message schedule if needed
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + // s0
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | // s1
              0);
      // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
      var temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // S0
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

      hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : "") + b.toString(16);
    }
  }
  return result;
};

// ------------------------------------------------------------------------------------------------------------------------

// ASCII TO HEX
// ------------------------------------------------------------------------------------------------------------------------
function ascii_to_hexa(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
}
// ------------------------------------------------------------------------------------------------------------------------

// HEX TO DECIMAL
// ------------------------------------------------------------------------------------------------------------------------

function h2d(s) {
  function add(x, y) {
    var c = 0,
      r = [];
    var x = x.split("").map(Number);
    var y = y.split("").map(Number);
    while (x.length || y.length) {
      var s = (x.pop() || 0) + (y.pop() || 0) + c;
      r.unshift(s < 10 ? s : s - 10);
      c = s < 10 ? 0 : 1;
    }
    if (c) r.unshift(c);
    return r.join("");
  }

  var dec = "0";
  s.split("").forEach(function (chr) {
    var n = parseInt(chr, 16);
    for (var t = 8; t; t >>= 1) {
      dec = add(dec, dec);
      if (n & t) dec = add(dec, "1");
    }
  });
  return dec;
}

// ------------------------------------------------------------------------------------------------------------------------

// DECIMAL TO HEX
function dec2hex(str) {
  // .toString(16) only works up to 2^53
  var dec = str.toString().split(""),
    sum = [],
    hex = [],
    i,
    s;
  while (dec.length) {
    s = 1 * dec.shift();
    for (i = 0; s || i < sum.length; i++) {
      s += (sum[i] || 0) * 10;
      sum[i] = s % 16;
      s = (s - sum[i]) / 16;
    }
  }
  while (sum.length) {
    hex.push(sum.pop().toString(16));
  }
  return hex.join("");
}

// ------------------------------------------------------------------------------------------------------------------------

// HEX TO ASCII
function hex2text(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
// hex2text('32343630'); // returns '2460'

//Implement generating comment page
//Clear local storage(only for testing purposes)
window.localStorage.clear();

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

function updateLocalStorage() {
  forums.forEach((convo, i) => {
    myStorage.setItem(`convo${i + 1}`, JSON.stringify(convo));
  });
}

updateLocalStorage();

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
}

function renderComments(comms) {
  comms.forEach(renderComment);
}

// for (var i = 0; i < myClasses.length; i++) {
//   console.log(myClasses[i].textContent);
// }

function keyXOR(key) {
  return h2d(ascii_to_hexa(sha256(key)));
}

function updateBox() {
  myClasses = document.getElementsByClassName("formatHex");
  let keyText = keyInput.value;
  let keyDec = keyXOR(keyText);
  for (var i = 0; i < myClasses.length; i++) {
    const xOrd = BigInt(h2d(hexComments[i])) ^ BigInt(keyDec);
    let text = hex2text(dec2hex(xOrd));
    if (text.includes("|")) {
      text = text.split("|")[1];
    }
    myClasses[i].innerHTML = text;
  }
}

//Implement crazy hacker view

function crazy() {
  keyInput.value = dec2hex(600 * Math.random());
  updateBox();
}

let interval = setInterval(crazy, 10);

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

// -------------------------------------------------------------

// I don't think we wrote a javascript version of the padding function yet?
// TODO: write a comment padding function
function padComment(commentStr) {
  // use left padding with pipes on either side of comment
  // determine length of string
  let pad = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 64 - commentStr.length - 2; i++) {
    // TODO: replace this insecure psuedorandom function with #crypto on node server instead
    pad += characters.charAt(Math.random() * 62);
  }
  return `${pad}|${commentStr}|`;
}

// This is trying to get the text that was submitted in the comment box as a javascript variable
// Then apply the padding function to that text

function addComment(comment) {
  if (comment.length > 62) {
    // TODO: if comment is too long, render an error message
    return;
  }
  // Pad comment
  comment_box.value = "";
  let commentPadded = padComment(comment);

  // This turns the padded comment into hex, then to decimal, then Xor's it with keydec, and then takes that xor output in decimal and turns it back into hex
  // not sure if the key in textbox is still keyDec but that is what should be Xor'ed with the comment
  // *note* keyDec is the decimal of the hash of the origional text - "key" should be the origional ascii
  let commentXorHex = dec2hex(
    BigInt(h2d(ascii_to_hexa(commentPadded))) ^ BigInt(keyXOR(keyInput.value))
  );
  // commentXorHex is what should be sent to be stored on database

  // TODO: Fix this horrible mess lol
  // add HTML of comment
  forums[1].push(commentXorHex);
  updateLocalStorage();
  renderComment(hexComments);
  changeForum(2);
}
const comment_box = document.querySelector(".commentBox");
const comment_btn = document.querySelector(".btn__comment");

comment_btn.addEventListener("click", () => {
  addComment(comment_box.value);
});
comment_box.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    console.log(comment_box.value.slice(0, -1));
    addComment(comment_box.value.slice(0, -1));
  }
});


// ----------------------
// TODO: Hide submenu items on top right of screen
  // I think there is the slider jquery function,
  // or if theres a way to make it so when you click the <img> in <div id="hider">
  // It changes class="submenu" display:flex; to display:none;



function menuHider() {
  var x = document.getElementById("submenu");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
