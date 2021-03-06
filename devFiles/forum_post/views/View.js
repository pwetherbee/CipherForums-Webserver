export default class View {
  _data;
  render(data, render = true) {
    //check if data exists
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.render_error();
    }
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  update(data) {
    if (!this._parentElement.textContent) {
      this.render(data);
    }
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup); // create new html element with new markup
    //create new nodes
    const newElements = Array.from(newDom.querySelectorAll("*"));
    const currElements = Array.from(this._parentElement.querySelectorAll("*"));
    console.log(currElements);
    newElements.forEach((newElement, i) => {
      const currElement = currElements[i];
      if (
        !newElement.isEqualNode(currElement) &&
        newElement.firstChild?.nodeValue.trim() !== ""
      ) {
        currElement.textContent = newElement.textContent;
      }
      if (!newElement.isEqualNode(currElement)) {
        Array.from(newElement.attributes).forEach((attribute) => {
          currElement?.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  render_error() {
    alert(this._errorMessage);
  }
}
