import { AJAX } from "../helpers/ajaxReq.js";
import { API_URL } from "../helpers/config.js";

const username = document.getElementsByName("username")[0];
const password = document.getElementsByName("password")[0];

let loginBtn = document.querySelector(".login-submission");

console.log(username, password);

loginBtn.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = {
    username: username.value,
    password: password.value,
  };
  let response = await AJAX(`${API_URL}/login`, user);
  if (response.valid) {
    let now = +new Date();
    console.log(now, response.timeout);
    localStorage.setItem("timeoutDate", now + response.timeout);
    localStorage.setItem("currUser", response.user);
    location.href = response.redirect;
    return;
  } else {
    alert(response.message);
  }
  //   location.href = response.redirect;
  //   console.log(response);
});
