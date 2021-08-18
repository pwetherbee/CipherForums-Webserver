"use strict";
// SHA256 A STRING
// ------------------------------------------------------------------------------------------------------------------------
import "regenerator-runtime/runtime";
import {
  dec_to_text,
  text_to_dec,
  key_to_dec,
  decrypt,
  sleep,
} from "./helpers/convert.js";
import keyView from "./views/keyView.js";
import { async } from "regenerator-runtime/runtime";
//Implement generating comment page

const endpoint = "https://cipherforums.com";
// const endpoint = "http://localhost:3000";

const demoComments = [
  "525622612505542007200a6204736f15695b31425150567764012c625b50794063474a65555e515d5a0745465e417459450951137058104759444c5b5e5d174b",
  "051542626301503e5c2a21744a5578680e3f223461224f760e5e10570044475f531447574f45100e504457175c5515440103040f12040a05411812175101171e",
  "7a2023041d52252a24754c620c50410a5d5b1f4116041b44175a1645575605445c42185c10441258455f5f414c4018435e5442005b1416535711110856411f4a",
  "2e4e684f304641135f404109104015446548135511571508034d17590f405e16400c544550594819585f5545155c5c18150d5942180c554611010b404a4b1a19",
];

const decryptCycle = async function (final = "default_key") {
  let interval = setInterval(() => {
    keyView.changeKeyValue(Math.floor(10 ** 8 * Math.random()).toString(16));
    controlUpdateKey();
  }, 40);
  setTimeout(() => {
    clearInterval(interval);
    keyView.changeKeyValue(final);
    controlUpdateKey();
  }, 800);
};

const controlInitialLoad = async function () {
  decryptCycle("default_key");
  var curr = 1;
  var options = ["default_key", "alt_key", "other_key", "banana"];
  let interval = setInterval(() => {
    decryptCycle(options[curr]);
    curr++;
    curr = curr % options.length;
  }, 5000);
  document
    .querySelector(".key__textbox")
    .addEventListener("click", () => clearInterval(interval));
};

const controlUpdateKey = async function () {
  // console.log("this was activated");
  // get current key
  let key = document.querySelector(".key__textbox").value;
  // convert key to dec
  const key_dec = key_to_dec(key);
  // decrypt all comments
  const decryptedComments = demoComments.map((enctext) =>
    decrypt(enctext, key_dec)
  );
  let commentEls = document.querySelectorAll(".commentBorderText2");
  for (let i = 0; i < commentEls.length; i++) {
    await sleep(30);
    // commentEls[i].innerHTML = decryptedComments[i] || "...";
    commentEls[i].innerHTML = parseComment(decryptedComments[i]);
  }
  // commentEls.forEach((commentEl, i) => {
  //   commentEl.textContent = decryptedComments[i];
  // });
};

const parseComment = function (comment) {
  if (!comment) {
    return "...";
  }
  if (comment.startsWith("#img[")) {
    return `<img src = ${comment.split("[")[1].slice(0, -1)}>`;
  }
  if (comment.startsWith("#video[")) {
    let embed = comment.split("[")[1].slice(0, -1).replace("watch", "embed");
    console.log(embed);
    return `<iframe width="420" height="315"
    src="${embed}">
    </iframe>`;
  }
  return comment;
};

// const controlCreateForum = async function () {
//   //create a new random forum with id
//   let newForum = await putForum();
//   location.href = `/threads/${newForum.newID}`;
// };

const putForum = async function (comment, url = `${endpoint}/api/threads`) {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!res?.ok) {
    alert("Post could not be created");
    return;
  }
  const data = res.json();
  // updateState(data);
  // console.log(data);
  return data;
};

const init = function () {
  let interval = controlInitialLoad();
  keyView.addHandlerInputText(controlUpdateKey);
  // document
  //   .querySelector(".create__forum__button")
  //   .addEventListener("click", controlCreateForum);
};
init();
