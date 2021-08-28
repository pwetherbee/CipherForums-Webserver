"use strict";
import "regenerator-runtime/runtime";
import { AJAX } from "../helpers/ajaxReq.js";
import { API_URL } from "../helpers/config.js";

const controlInitialLoad = async function () {
  // get username
  const url = window.location.href;
  const username = url.split("/").slice(-2)[0];
  // Load following page
  const data = await AJAX(
    `${API_URL}/user/${username}/following/list/${username}`
  ); // TODO: Fix this redundancy
  console.log(data);
  const followList = document.querySelector(".following__list");
  let markup = "";
  console.log(data.following);
  data.following.forEach((user) => {
    markup += `<li><a href="${API_URL}/user/${user.username}">@${user.username}</a></li>`;
  });
  // Insert into html element
  followList.insertAdjacentHTML("afterbegin", markup);
};

const init = function () {
  console.log("this is running");
  controlInitialLoad();
};

console.log("this is running");

init();
