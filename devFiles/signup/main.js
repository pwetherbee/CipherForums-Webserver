import { AJAX } from "../helpers/ajaxReq.js";
import { API_URL } from "../helpers/config.js";

const username = document.getElementsByName("username")[0];
const password = document.getElementsByName("password")[0];
const email = document.getElementsByName("email")[0];

let loginBtn = document.querySelector(".signup-submission");

loginBtn.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = {
    username: username.value,
    password: password.value,
    email: email.value,
  };
  //   console.log(user);
  let response = await AJAX(`${API_URL}/signup`, user);
  // console.log(response.redirect);
  location.href = `${response.redirect}/login`;
  //   console.log(response);
});
