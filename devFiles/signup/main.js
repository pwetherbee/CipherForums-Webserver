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
  let response;
  try {
    response = await AJAX(`${API_URL}/signup`, user);
    location.href = `${response.redirect}/login`;
    if (response.error) {
      // TODO: Render username already exists message
      alert(response.response);
    } else {
    }
  } catch (err) {
    alert(err);
  }

  // console.log(response.redirect);

  //   console.log(response);
});
