import "regenerator-runtime/runtime";
import * as model from "./model.js";
import forumView from "./views/forumView.js";
import keyView from "./views/keyView.js";
import "core-js/stable"; // or more selective import, like "core-js/es/array"
import {
  dec_to_text,
  text_to_dec,
  key_to_dec,
  decrypt,
  sleep,
} from "../helpers/convert.js";
let commentEls;

const controlInitialLoad = async function () {
  let url = window.location.href;
  console.log(url);
  let id = url.split("/").slice(-1);
  console.log(id);
  let data;
  try {
    data = await model.getForum(id);
  } catch (e) {
    forumView.render_error();
    return;
  }
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

const controlForumView = async function (id = 999) {
  const data = await model.getForum(id);
  forumView.render(data);
  commentEls = document.querySelectorAll(".comment__body");
  await controlUpdateKey();
};

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

const controlPostComment = async function () {
  const commentTextBox = document.querySelector(".comment__textbox");
  const commentText = commentTextBox.value;
  if (!commentText || commentText.length > 60) {
    return;
  }
  const key = document.querySelector(".key__textbox").value;
  let commentEncrypted = text_to_dec(commentText, key);
  const currTime = +new Date() / 1000;
  const authorTest = "test_author";
  const comment = {
    author: authorTest,
    time: currTime,
    text: commentEncrypted,
  };
  await model.postComment(comment);
  commentTextBox.value = "";
  // TODO: just render latest comment, not entire thread
  console.log("comment was posted");
  const unencrypted = { ...comment };
  unencrypted["text"] = parseComment(commentText);
  forumView.pushComment(unencrypted);
  commentEls = document.querySelectorAll(".comment__body");
};

const controlHideKey = async function () {
  keyView.hideKey();
};

const init = function () {
  controlInitialLoad();
  forumView.addHandlerRender(controlInitialLoad);
  keyView.addHandlerInputText(controlUpdateKey);
  keyView.addHandlerHideKey(controlHideKey);
  let searchBar = document.querySelector(".search__textbox");
  let searchButton = document.querySelector(".search__btn");
  searchButton.addEventListener("click", (e) => {
    controlForumView(searchBar.value);
  });
  let submitButton = document.querySelector(".btn__comment");
  submitButton.addEventListener("click", controlPostComment);
  //night mode
  document.querySelector(".switch").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
};

init();
