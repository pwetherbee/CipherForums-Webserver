import "regenerator-runtime/runtime";
import * as model from "./model.js";
import forumView from "./views/forumView.js";
import keyView from "./views/keyView.js";
import "core-js/stable"; // or more selective import, like "core-js/es/array"
import moment from "moment";
import {
  dec_to_text,
  text_to_dec,
  key_to_dec,
  decrypt,
  sleep,
} from "../helpers/convert.js";
import { async } from "regenerator-runtime/runtime";
let commentEls;

// Run when page is first loaded
const controlInitialLoad = async function () {
  let url = window.location.href;
  let id = url.split("/").slice(-1); // Grabs url after /threads/
  let data;
  try {
    data = await model.getForum(id);
  } catch (e) {
    forumView.render_error();
    return;
  }
  if (data === "404") {
    console.log("forum does not exist");
    return;
  }
  // Set date at the end of the forum post
  document.querySelector(".date").textContent =
    model.state.date || "date does not exist";
  forumView.render(data);
  forumView.setForumInfo();
  commentEls = document.querySelectorAll(".comment__body");
  let interval = setInterval(() => {
    keyView.changeKeyValue(Math.floor(10 ** 8 * Math.random()).toString(16));
    controlUpdateKey();
  }, 40);
  setTimeout(() => {
    clearInterval(interval);
    keyView.changeKeyValue("default_key");
    controlUpdateKey();
  }, 500);
};

// Renders forum
const controlForumView = async function (id = 999) {
  const data = await model.getForum(id);
  forumView.render(data);
  commentEls = document.querySelectorAll(".comment__body");
  await controlUpdateKey();
};

// Changes ciphertext whenever key is changed
const controlUpdateKey = async function () {
  // get current key
  let key = document.querySelector(".key__textbox").value;
  // convert key to dec
  const key_dec = key_to_dec(key);
  // get all comments
  const encryptedComments = model.state.comments.map((comment) => comment.text);
  // decrypt all comments
  const decryptedComments = encryptedComments.map((enctext) =>
    decrypt(enctext, key_dec)
  );
  commentEls = document.querySelectorAll(".comment__body");
  for (let i = 0; i < commentEls.length; i++) {
    await sleep(30);
    // commentEls[i].innerHTML = decryptedComments[i] || "...";
    commentEls[i].innerHTML = parseComment(decryptedComments[i]);
  }
  // commentEls.forEach((commentEl, i) => {
  //   commentEl.textContent = decryptedComments[i];
  // });
};

// Converts raw encoded text to proper form
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

// Allow user to post comment and send update to web server
const controlPostComment = async function () {
  const commentTextBox = document.querySelector(".comment__textbox");
  const commentText = commentTextBox.value;
  if (!commentText || commentText.length > 60) {
    return;
  }
  const key = document.querySelector(".key__textbox").value;
  let commentEncrypted = text_to_dec(commentText, key);
  const currTime = moment.utc();
  const authorTest = "Anonymous";
  // TODO: Check timeout on this before posting as user
  const comment = {
    forumID: model.state.id,
    author: localStorage.getItem("currUser") || authorTest,
    time: currTime,
    text: commentEncrypted,
  };
  await model.postComment(comment);
  commentTextBox.value = "";
  // TODO: just render latest comment, not entire thread
  const unencrypted = { ...comment };
  unencrypted["text"] = parseComment(commentText);
  forumView.pushComment(unencrypted);
  commentEls = document.querySelectorAll(".comment__body");
};

// Create new random forum ** will be deprecated soon
const controlCreateForum = async function () {
  //create a new random forum with id
  let newForum = await model.putForum();
  location.href = `/threads/${newForum.newID}`;
};

// Hide values in key textbox
const controlHideKey = async function () {
  keyView.hideKey();
};

// Dark mode fuctionality
const controlNightSwitch = async function () {
  let nightModeSwitch = document.querySelector(".switch");
  document.body.classList.toggle("dark-mode");
  let theme = "light";
  if (document.body.classList.contains("dark-mode")) {
    theme = "dark";
  }
  nightModeSwitch.textContent =
    nightModeSwitch.textContent == "????" ? "????" : "????";
  localStorage.setItem("theme", theme);
};

// Run all functions when page loads
const init = function () {
  const currentTheme = localStorage.getItem("theme");

  let nightModeSwitch = document.querySelector(".switch");
  if (currentTheme == "dark") {
    document.body.classList.toggle("dark-mode");
    nightModeSwitch.textContent = "????";
  }
  controlInitialLoad();
  forumView.addHandlerRender(controlInitialLoad);
  keyView.addHandlerInputText(controlUpdateKey);
  keyView.addHandlerHideKey(controlHideKey);
  // let createForumButton = document.querySelector(".create__forum__btn");
  // createForumButton.addEventListener("click", controlCreateForum);
  let submitButton = document.querySelector(".btn__comment");
  submitButton.addEventListener("click", controlPostComment);

  //night mode
  nightModeSwitch.addEventListener("click", controlNightSwitch);
};

init();
