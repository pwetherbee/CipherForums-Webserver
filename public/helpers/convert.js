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

// function hex_to_dec(s) {
//   function add(x, y) {
//     var c = 0,
//       r = [];
//     var x = x.split("").map(Number);
//     var y = y.split("").map(Number);
//     while (x.length || y.length) {
//       var s = (x.pop() || 0) + (y.pop() || 0) + c;
//       r.unshift(s < 10 ? s : s - 10);
//       c = s < 10 ? 0 : 1;
//     }
//     if (c) r.unshift(c);
//     return r.join("");
//   }

//   var dec = "0";
//   s.split("").forEach(function (chr) {
//     var n = parseInt(chr, 16);
//     for (var t = 8; t; t >>= 1) {
//       dec = add(dec, dec);
//       if (n & t) dec = add(dec, "1");
//     }
//   });
//   return dec;
// }

function hex_to_dec(s) {
  const hex = "0x" + String(s);
  return BigInt(hex).toString(10);
}

function dec_to_hex(bn) {
  var base = 16;
  var hex = BigInt(bn).toString(base);
  if (hex.length % 2) {
    hex = "0" + hex;
  }
  return hex;
}
// ------------------------------------------------------------------------------------------------------------------------

// DECIMAL TO HEX
// function dec_to_hex(str) {
//   // .toString(16) only works up to 2^53
//   var dec = str.toString().split(""),
//     sum = [],
//     hex = [],
//     i,
//     s;
//   while (dec.length) {
//     s = 1 * dec.shift();
//     for (i = 0; s || i < sum.length; i++) {
//       s += (sum[i] || 0) * 10;
//       sum[i] = s % 16;
//       s = (s - sum[i]) / 16;
//     }
//   }
//   while (sum.length) {
//     hex.push(sum.pop().toString(16));
//   }
//   return hex.join("");
// }

// function dec_to_hex(str) {
//   return parseInt(str).toString(16);
// }

// ------------------------------------------------------------------------------------------------------------------------

// HEX TO ASCII
function hex_to_text(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

function padText(commentStr) {
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

function key_to_dec(key) {
  return hex_to_dec(ascii_to_hexa(sha256(key)));
}

function dec_to_text(hex, key_dec) {
  // const key_dec = hex_to_dec(ascii_to_hexa(sha256(key)));
  const xOrd = BigInt(hex_to_dec(hex)) ^ BigInt(key_dec);
  let text = hex_to_text(dec_to_hex(xOrd));
  if (text.includes("|")) {
    text = text.split("|")[1];
  }
  return text;
}

function text_to_dec(text, key) {
  let paddedText = padText(text);
  let commentXorHex = dec_to_hex(
    BigInt(hex_to_dec(ascii_to_hexa(paddedText))) ^ BigInt(key_to_dec(key))
  );
  return commentXorHex;
}

function decrypt(text_hex, key_decimal) {
  return dec_to_text(text_hex, key_decimal);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// export { sha256, ascii_to_hexa, hex_to_dec, dec_to_hex, hex_to_text };
export { dec_to_text, text_to_dec, key_to_dec, decrypt, sleep };
