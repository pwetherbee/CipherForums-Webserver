"use strict";

import { AJAX } from "../helpers/ajaxReq";
import { API_URL } from "../helpers/config";

const controlFormSubmit = async function (e) {
  e.preventDefault();
  // TODO: Validate input
  // Grab information from fields
  const title = document.querySelector(".titleInput").value;
  const subTitle = document.querySelector(".subTitleInput").value;
  const key = document.querySelector(".postKeyInput").value;
  // make ajax post request to web server
  const data = {
    title: title || "",
    subtitle: subTitle || "",
    keyID: key || "",
  };
  console.log(data);
  console.log(`${API_URL}/create/forum`);
  const res = AJAX(`${API_URL}/create/forum`, data);
};

const init = function () {
  document
    .querySelector(".submit__forum")
    .addEventListener("click", controlFormSubmit);
};

init();
