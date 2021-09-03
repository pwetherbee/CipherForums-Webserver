import View from "./View.js";
import moment from "moment";
import { API_URL } from "../../helpers/config.js";

class ForumView extends View {
  _parentElement = document.querySelector(".thread__container");
  _container = this._parentElement.parentElement;
  _errorMessage = "Could not render thread";
  addHandlerRender(handler) {
    ["load", "hashchange"].forEach((event) =>
      document.addEventListener(event, handler)
    );
  }
  _generateMarkup() {
    let markup = "";
    this._data.comments.forEach((comment) => {
      markup += this._commentMarkup(comment, true);
    });
    return markup;
  }
  _commentMarkup(comment, init = false) {
    // console.log(time);
    // let time = new Date(comment.time * 1000).toLocaleDateString("en-US");
    // console.log(moment.utc(comment.time).local());
    let date = new Date(moment.utc(comment.time)).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
    // // console.log(new Date(String(comment.time)));
    // let iso = new Date(moment.utc(comment.time));
    // console.log("iso time", iso);
    // console.log("sql time", comment.time);
    // console.log("moment converting utc", moment.utc(comment.time));
    // // console.log(moment.time);
    // // console.log(date);
    // // date = new Date(comment.time);
    return `
        <div class="comment__container">
          <h class="comment__header"><a href = ${API_URL}/user/${
      comment.author
    }>@${comment.author}</a> on ${
      date || "unknown"
    } said: <btn class = "btn__reply">[reply]</btn></h>
          <p class="comment__body">
              ${init ? "&shy" : comment.text}
          </p>
        </div>
        `;
  }
  pushComment(comment) {
    let markup = this._commentMarkup(comment);
    this._parentElement.insertAdjacentHTML("beforeend", markup);
  }
  getComments() {
    return this._parentElement.querySelectorAll(".comment__body");
  }
  setForumInfo() {
    document.querySelector(
      ".posterUser"
    ).innerHTML = `<a href = ${API_URL}/user/${this._data.author}>@${this._data.author}</a>`;
    //`@${this._data.author}`;
    document.querySelector(".forum__title").textContent = `[${this._data.title
      .split("!")
      .slice(0, 1)}]`;
    document.querySelector(".subtitle").innerHTML = `${
      this._data.subtitle.startsWith("#img[")
        ? `<img src = ${this._data.subtitle.split("[")[1].slice(0, -1)}>`
        : this._data.subtitle
    }`;
  }
}

export default new ForumView();
