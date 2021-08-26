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
  // render created posts

  // show favorited posts
  // show updated feed
};

const getCreatedForums = async function (username) {
  // make ajax request
  const data = await AJAX(`${API_URL}/api/${username}/created`);
  console.log(data);
};

const init = function () {
  controlInitialLoad();
};

init();
