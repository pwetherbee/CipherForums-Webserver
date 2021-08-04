import View from "./View";

class KeyView extends View {
  _parentElement = document.querySelector(".key__container");
  _keyTextbox = this._parentElement.querySelector(".key__textbox");
  addHandlerInputText(handler) {
    this._parentElement
      .querySelector(".key__textbox")
      .addEventListener("input", handler);
  }
  changeKeyValue(newKey) {
    this._keyTextbox.value = newKey;
  }
  hideKey() {
    this._keyTextbox.type =
      this._keyTextbox.type === "text" ? "password" : "text";
  }
  addHandlerHideKey(handler) {
    this._parentElement
      .querySelector(".btn__hide")
      .addEventListener("click", handler);
  }
}

export default new KeyView();
