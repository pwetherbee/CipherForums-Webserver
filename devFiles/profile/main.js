"use strict";
import "regenerator-runtime/runtime";
import { AJAX } from "../helpers/ajaxReq.js";
import { API_URL } from "../helpers/config.js";
// TODO: Apply MVC architecture to this
// Control inital load
const controlInitialLoad = async function (username) {
  // show user profile title and description
  // get username from url

  const createdForums = await getCreatedForums(username);
  // show created posts
  document.querySelector(".username").textContent = `@${username}`;
  const postHolderContainer = document.querySelector(".postHolder");
  let markup = "";
  createdForums.forEach((forum) => {
    markup += `
    <div class="forumPost">
    <a class="postTitle" href="/threads/${forum.title}">${forum.title}</a>
      <div class="postSubTitle">
      </div>
    </div>
      `;
  });
  postHolderContainer.insertAdjacentHTML("afterbegin", markup);
  // render created posts

  // show favorited posts
  // show updated feed
  // show create a forum button
  const now = +new Date();
  let timeoutDate = localStorage.getItem("timeoutDate");
  if (
    timeoutDate &&
    timeoutDate - now > 0 &&
    username == localStorage.getItem("currUser")
  ) {
    let createForumBtn = document.querySelector(".createUserForum").classList;
    createForumBtn.remove("hidden");
  } else {
  }
};

const controlFollowButton = async function () {
  // grab username from url
  const url = window.location.href;
  const user = url.split("/").slice(-1)[0];
  // make ajax request to follow on web server
  const input = { username: user };
  const data = await AJAX(`${API_URL}/user/${user}/following`, input);
};

const getCreatedForums = async function (username) {
  // make ajax request
  const data = await AJAX(`${API_URL}/api/${username}/created`);
  return data;
};

const init = function () {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme == "dark") {
    document.body.classList.toggle("dark-mode");
    // nightModeSwitch.textContent = "💡";
  }

  const url = window.location.href;
  const username = url.split("/").slice(-1)[0];
  controlInitialLoad(username);
  document.querySelector(".logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("timeoutDate");
    localStorage.removeItem("currUser");
    location.href = "../logout";
  });
  document.querySelector(".follow__button").addEventListener("click", (e) => {
    e.preventDefault();
    controlFollowButton();
  });
  document.querySelector(".following").addEventListener("click", (e) => {
    e.preventDefault();
    location.href = `${API_URL}/user/${username}/following`;
  });
};

init();
