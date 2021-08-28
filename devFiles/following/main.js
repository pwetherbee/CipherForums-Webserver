"use strict";
import "regenerator-runtime/runtime";
import { AJAX } from "../helpers/ajaxReq.js";
import { API_URL } from "../helpers/config.js";

const controlInitialLoad = async function () {
  // get username
  const url = window.location.href;
  const username = url.split("/").slice(-1)[0];
  // Load following page
  const data = AJAX(`${API_URL}/user/${username}/following/list/${username}`); // TODO: Fix this redundancy
  console.log(data);
};

const init = function () {
  console.log("this is running");
  controlInitialLoad();
};

console.log("this is running");

init();
