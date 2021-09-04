"use strict";
import { AJAX } from "../helpers/ajaxReq";
import { API_URL } from "../helpers/config";
const chatIcon = require("../assets/chatIcon2.png");
// Load all data from web server and fill in html dynamically

let state = {
  username: "",
  bio: "",
  createdPosts: [],
  currUser: false,
  isFollowing: false,
  loggedIn: false,
};

const updateState = function (data) {
  Object.assign(state, data);
};

const controlInitialLoad = async function () {
  const url = window.location.href;
  const username = url.split("/").slice(-1)[0];
  const postHolderContainer = document.querySelector(".postHolderContainer");
  // Load all relevant data into state
  const data = await AJAX(`${API_URL}/user/${username}/info`);
  updateState(data);
  // Update html elements accordingly
  console.log(data);
  if (!state.username) {
    // If user does not exist, render 404 profile does not exist error
    // TODO: Render 404 error
    return;
  }
  document.querySelector(".username").innerHTML = `@${state.username} ${
    state.isFollowing && !state.currUser
      ? `<h class = "followingMarker">you follow this user ✔</h>`
      : ""
  }`;
  //   document.querySelector(".bio").textContent = `@${state.bio}`;
  postHolderContainer.insertAdjacentHTML(
    "afterbegin",
    await renderPosts(data.createdPosts, username)
  );
  // Only render follow button if current user has not followed that profile
  const followBtn = document.querySelector(".follow__button");
  if (!state.isFollowing && state.loggedIn) {
    followBtn.classList.remove("hidden");
  }
  // Render create forum button if logged in
  if (state.loggedIn && state.currUser) {
    document.querySelector(".createUserForum").classList.remove("hidden");
  }
  renderNavBar();
};

const controlFollowButton = async function () {
  // grab username from url
  const url = window.location.href;
  const user = url.split("/").slice(-1)[0];
  // make ajax request to follow on web server
  const input = { username: user };
  const data = await AJAX(`${API_URL}/user/${user}/following`, input);
};

const renderNavBar = async function () {
  if (state.loggedIn) {
    const navEl = document.querySelector(".logoutBtn");
    navEl.textContent = "Logout";
    navEl.href = `${API_URL}/logout`;
  }
};

const renderPosts = async function (posts, username) {
  // TODO: change username to be taken from forum object
  let markup = "";
  posts.forEach((forum) => {
    // markup += `
    //     <div class="forumPost">
    //     <a class="postTitle" href="${username}/thread/${forum.url}">${
    //   forum.url
    // }</a>
    //       <div class="postSubTitle">
    //       ${
    //         forum.subtitle?.startsWith("#img[")
    //           ? `<img width = "300vmin" src = ${forum.subtitle
    //               .split("[")[1]
    //               .slice(0, -1)}>`
    //           : forum.subtitle
    //       }
    //       </div>
    //     </div>
    //       `;
    markup += `
    <div class="postHolder">
    <div class="forumPost">
        <img class="titleImage ${forum.image ? "" : "textIcon"}" src=${
      forum.image || chatIcon
    } />
        <div class="forumPostHolder">
        <a class="postTitle" href="${username}/thread/${forum.url}">${
      forum.url
    }</a>
        <p class="postSubTitle">
            ${forum.subtitle}
        </p>
        </div>
    </div>
    </div>`;
  });
  return markup;
};

const init = function () {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme == "dark") {
    document.body.classList.toggle("dark-mode");
    // nightModeSwitch.textContent = "💡";
  }
  controlInitialLoad();
  document.querySelector(".follow__button").addEventListener("click", (e) => {
    e.preventDefault();
    controlFollowButton();
  });
  document.querySelector(".following").addEventListener("click", (e) => {
    e.preventDefault();
    location.href = `./${state.username}/following`;
  });
};

init();
