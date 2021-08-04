import View from "./View.js";

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
    let time = new Date(comment.time * 1000).toLocaleDateString("en-US");
    return `
        <div class="comment__container">
          <h class="comment__header">${
            comment.author
          } at ${time} said: <btn class = "btn__reply">[reply]</btn></h>
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
    this._container.querySelector(
      ".forum__title"
    ).textContent = `Post by ${this._data.author}`;
  }
}

export default new ForumView();
