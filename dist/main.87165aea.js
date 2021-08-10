// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"following/main.js":[function(require,module,exports) {
"use strict"; // SHA256 A STRING
// ------------------------------------------------------------------------------------------------------------------------
// import {
//   sha256,
//   ascii_to_hexa,
//   hex_to_dec,
//   hex_to_text,
//   dec_to_hex,
// } from "./helpers/convert";

var sha256 = function sha256(ascii) {
  function rightRotate(value, amount) {
    return value >>> amount | value << 32 - amount;
  }

  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = "length";
  var i, j; // Used as a counter across the whole file

  var result = "";
  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8; //* caching results is optional - remove/add slash from front of this line to toggle
  // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
  // (we actually calculate the first 64, but extra values are just ignored)

  var hash = sha256.h = sha256.h || []; // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes

  var k = sha256.k = sha256.k || [];
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

      hash[primeCounter] = mathPow(candidate, 0.5) * maxWord | 0;
      k[primeCounter++] = mathPow(candidate, 1 / 3) * maxWord | 0;
    }
  }

  ascii += "\x80"; // Append Ƈ' bit (plus zero padding)

  while (ascii[lengthProperty] % 64 - 56) {
    ascii += "\x00";
  } // More zero padding


  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return; // ASCII check: only accept characters in range 0-255

    words[i >> 2] |= j << (3 - i) % 4 * 8;
  }

  words[words[lengthProperty]] = asciiBitLength / maxWord | 0;
  words[words[lengthProperty]] = asciiBitLength; // process each chunk

  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration

    var oldHash = hash; // This is now the undefinedworking hash", often labelled as variables a...g
    // (we have to truncate as well, otherwise extra entries at the end accumulate

    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      var i2 = i + j; // Expand the message into 64 words
      // Used below if

      var w15 = w[i - 15],
          w2 = w[i - 2]; // Iterate

      var a = hash[0],
          e = hash[4];
      var temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + (e & hash[5] ^ ~e & hash[6]) + // ch
      k[i] + (w[i] = i < 16 ? w[i] : w[i - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ w15 >>> 3) + // s0
      w[i - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ w2 >>> 10) | // s1
      0); // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble

      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + (a & hash[1] ^ a & hash[2] ^ hash[1] & hash[2]); // maj

      hash = [temp1 + temp2 | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()

      hash[4] = hash[4] + temp1 | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = hash[i] + oldHash[i] | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = hash[i] >> j * 8 & 255;
      result += (b < 16 ? 0 : "") + b.toString(16);
    }
  }

  return result;
}; // ------------------------------------------------------------------------------------------------------------------------
// ASCII TO HEX
// ------------------------------------------------------------------------------------------------------------------------


function ascii_to_hexa(str) {
  var arr1 = [];

  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }

  return arr1.join("");
} // ------------------------------------------------------------------------------------------------------------------------
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
} // ------------------------------------------------------------------------------------------------------------------------
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
} // ------------------------------------------------------------------------------------------------------------------------
// HEX TO ASCII


function hex2text(hexx) {
  var hex = hexx.toString(); //force conversion

  var str = "";

  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return str;
} // hex2text('32343630'); // returns '2460'
// ------------------------------------------------------------------------------------------------------------------------
// DEMO VARIABLES
// var text = "BNAfCyvWUFSvCpfpTlUnwYIxBcHLojfMCMCwWwXPOMIv|here is my message|"
// messageHex = ascii_to_hexa(text)
// messageDec = h2d(messageHex)
// key = "a"
// key = document.getElementById("test").value;
// keyHash = sha256(key);
// keyHex = ascii_to_hexa(keyHash);
// keyDec = h2d(keyHex);
// ------------------------------------------------------------------------------------------------------------------------
// ATTEMPT TO XOR HTML CLASS
// var pID = document.getElementsByClassName("formatHex")[0].innerHTML;
// console.log(pID)
// // XON ON SCREEN HEX WITH THE KEY
// // SCREEN HEX TO DECIMAL
// decryptDecimal = h2d(pID)
// // XOR DECIMAL WITH KEY
// decryptXorWithN = BigInt(decryptDecimal) ^ BigInt(keyDec)
// // REMOVE N APPENDED AFTER XOR
// decryptXor = decryptXorWithN.toString()
// // XOR DECIMAL TO HEX
// decryptXorToHex = dec2hex(decryptXor)
// // XOR HEX TO TEXT
// decryptToText = hex2text(decryptXorToHex)
// console.log(decryptToText)
//Implement generating comment page


var myStorage = window.localStorage;
var commentContainer = document.querySelector(".comments");
var forumButtons = document.querySelectorAll(".select");
var hideBtn = document.querySelector(".btn__hide");
var keyInput = document.querySelector(".key__textbox");
hideBtn.addEventListener("click", function () {
  keyInput.type = keyInput.type === "text" ? "password" : "text";
});
var thread1 = ["7f741c422a0a640a08312043405371345970035e2d7442435b090b444375767e5c717d536444705c473a086a67077b744336480c534411535352530a0204034b", "5d7c2049170f51371c2532784072543c6a542f7a2e44514d5c450e504152185b40175712535d5f5f520c111e1118584547415e004c4d425b471708594b4a4f4b", "5b4402771d2d5f01092e3b545b7775015d6232431e597e6c6327104645524d4e50585b5f555c4612540d085f540f4310560e590c5359161257580f55545e424b"];
var thread2 = ["7c67096225377e162f0d00506179590a4859306d3d4b405b750f306d50644d7e7962415c614e5a574e42005c52134e4041085b0f165e11125656065c5043454b", "5a7928680b0c61252309104d787d4e3d465e1a5d0550555c52451150135559515847445d5740535f5a070112430453545c151841525207481459174c4211164b", "6e5a0d62022c6e24102608415a485c12454e1250174c14575c080b505d43185a56455313105c5d465f0b0b5511155810590e5b0a165616125d1711594811164b", "407b294a0211520526061d5f57495745445a0f4644555147400401501340594113525851424b42465206454558155f104109514152520453415b16675a554f4b"];
var thread3 = ["636712702b1044250e0e1444745b5d27537c0c643c7d7b505b19145a505c18535d5316405f5e5e125c0700424241455f560a5d0f16560c5614450d545d59584b", "535f127d02046300370f137c4476440d515a075d05185b5c1308075b1343505b40175f4110531251580f08575f151b10420e410d521016124d56424b5049094b", "67660e743e3b6011130f16707a695233576808573c6b415c46152f614073794e43564453545d4a120a42115a5812175946415a0e4217031257580f55545e424b"];
var forums = [thread1, thread2, thread3];
var hexComments = [];
forums.forEach(function (convo, i) {
  myStorage.setItem("convo".concat(i + 1), JSON.stringify(convo));
});
var myClasses = document.getElementsByClassName("formatHex");

function changeForum(id) {
  hexComments = JSON.parse(myStorage.getItem("convo".concat(id)));
  updateBox();
}

forumButtons.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    var i = btn.getAttribute("data-index");
    changeForum(i);
  });
});
changeForum(2);
renderComments(hexComments);

function renderComment(comment) {
  commentContainer.insertAdjacentHTML("afterbegin", "\n  <div class=\"insideForum\">\n    <p class=\"formatHex\">\n        ".concat(comment, "\n    </p>\n  </div>\n  "));
  myClasses = document.getElementsByClassName("formatHex");
}

function renderComments(comms) {
  comms.forEach(renderComment);
}

for (var i = 0; i < myClasses.length; i++) {
  console.log(myClasses[i].textContent);
}

function keyXOR(key) {
  return h2d(ascii_to_hexa(sha256(key)));
}

function updateBox() {
  var keyText = keyInput.value;
  var keyDec = keyXOR(keyText);

  for (var i = 0; i < myClasses.length; i++) {
    var xOrd = BigInt(h2d(hexComments[i])) ^ BigInt(keyDec);
    var text = hex2text(dec2hex(xOrd));

    if (text.includes("|")) {
      text = text.split("|")[1];
    }

    myClasses[i].innerHTML = text;
  }
} //Implement crazy hacker view


function crazy() {
  keyInput.value = dec2hex(600 * Math.random());
  updateBox();
}

var interval = setInterval(crazy, 20);
setTimeout(function () {
  clearInterval(interval);
  keyInput.value = "default_key";
  updateBox();
}, 500); // keyInput.addEventListener("keypress", (e) => {
//   console.log(e.key);
//   if (e.key === "Enter") {
//     updateBox();
//   }
// });

keyInput.addEventListener("input", updateBox); //Implement add comment

function menuHider() {
  var x = document.getElementById("submenu");

  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54150" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","following/main.js"], null)
//# sourceMappingURL=/main.87165aea.js.map