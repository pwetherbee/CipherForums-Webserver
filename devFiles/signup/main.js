import { AJAX } from "../helpers/ajaxReq.js";
import { API_URL } from "../helpers/config.js";

const username = document.getElementsByName("username")[0];
const password = document.getElementsByName("password")[0];
const email = document.getElementsByName("email")[0];

let loginBtn = document.querySelector(".signup-submission");

loginBtn.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = {
    username: username.value,
    password: password.value,
    email: email.value,
  };
  AJAX(`${API_URL}/signup`, user);
});