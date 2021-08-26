"use strict";
import "regenerator-runtime/runtime";
import { AJAX } from "../helpers/ajaxReq.js";
import { API_URL } from "../helpers/config.js";
// TODO: Apply MVC architecture to this
// Control inital load
const controlInitialLoad = async function () {
  // show user profile title and description
  // get username from url
  const url = window.location.href;
  const username = url.split("/").slice(-1)[0];
  const createdForums = await getCreatedForums(username);
  // show created posts
  document.querySelector(".username").textContent = `@${username}`;
  const postHolderContainer = document.querySelector(".postHolder");
  let markup = "";
  createdForums.forEach((forum) => {
    markup += `
    <div class="forumPost">
    <a class="postTitle" href="${API_URL}/threads/${forum.title}">${forum.title}</a>
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
  if (timeoutDate && timeoutDate - now > 0) {
    let createForumBtn = document.querySelector(".createUserForum").classList;
    createForumBtn.remove("hidden");
  } else {
    localStorage.removeItem("timeoutDate");
  }
};

const getCreatedForums = async function (username) {
  // make ajax request
  const data = await AJAX(`${API_URL}/api/${username}/created`);
  return data;
};

const init = function () {
  controlInitialLoad();
  document.querySelector(".logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("timeoutDate");
    localStorage.removeItem("currUser");
    location.href = "../logout";
  });
};

init();
