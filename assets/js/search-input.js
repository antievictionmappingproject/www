import {
  LitElement,
  html,
  css,
} from "https://cdn.skypack.dev/lit-element@2.4.0";

const keyCodes = {
  up: 38,
  down: 40,
  return: 13,
  tab: 9,
};

function clamp(min, max, value) {
  return Math.max(Math.min(value, max), min);
}

function occurrences(string, subString) {
  string += "";
  subString += "";
  if (subString.length <= 0) {
    return string.length + 1;
  }
  let n = 0,
    pos = 0,
    step = subString.length;
  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
}

class SearchInput extends LitElement {
  static get properties() {
    return {
      _value: { type: String },
      isOpen: { type: Boolean },
      _selectedIndex: { type: Number },
      options: { type: Array },
    };
  }

  constructor() {
    super();
    this._value = "";
    this.isOpen = false;
    this._selectedIndex = 0;
    this.options = [];
    this.suggestedOptions = [];
    this.getOptions();
    this._handleDocumentClick = this._handleDocumentClick.bind(this);
  }

  set selectedIndex(value) {
    this._selectedIndex = clamp(0, this.suggestedOptions.length - 1, value);
  }

  get selectedIndex() {
    return this._selectedIndex;
  }

  set value(value) {
    this._value = value;
    const matchMap = this.options
      .map((option) => [
        option,
        occurrences(
          option.content
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .replace(/\s/g, " "),
          value.toLowerCase()
        ),
      ])
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 10);
    this.suggestedOptions =
      this.value.trim().length > 0 ? matchMap.map(([option]) => option) : [];
  }

  get value() {
    return this._value;
  }

  get selectedOption() {
    return this.suggestedOptions[this.selectedIndex];
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this._handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._handleDocumentClick);
  }

  static styles = css`
    :host {
      position: relative;
    }
    dl {
      list-style: none;
      margin: 0;
      padding: 0;
      position: absolute;
      top: 100%;
      left: 0;
      max-width: 100%;
    }
    dl > div {
      padding: 0.5rem;
      border: solid 2px var(--white);
      border-radius: 1rem;
      background: var(--white);
      box-shadow: 0 1rem 2rem -0.5rem var(--black-5);
      margin-top: 0.25rem;
    }
    dl > div.selected {
      border-color: var(--blue);
      background: var(--lightest-blue);
    }
    dt {
      font-size: var(--f0);
      color: var(--black);
    }
    dd {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: var(--f00);
    }
    .hidden {
      display: none;
    }
  `;

  render() {
    return html`
      <link href="/assets/css/reset.css" rel="stylesheet" />
      <link href="/assets/css/main.css" rel="stylesheet" />
      <input
        @focus="${this._handleFocus}"
        @input="${this._handleInput}"
        @keydown="${this._handleKeydown}"
        value="${this._value}"
        role="combobox"
        aria-autocomplete="list"
        autocomplete="off"
        autocapitalize="none"
        type="text"
        id="search"
        class="search-input"
        placeholder="Search for an article"
      />
      <dl role="listbox" class="${this.isOpen ? "" : "hidden"}">
        ${this.suggestedOptions.map(
          (option, i) =>
            html` <div
              @click="${this.dispatchSubmit}"
              @mouseenter="${this._handleMouseenter}"
              role="option"
              tabindex="-1"
              data-index="${i}"
              class="${this._selectedIndex === i ? "selected" : "none"}"
            >
              <dt>${option.title}</dt>
              <dd>${option.content}</dd>
            </div>`
        )}
      </dl>
      <div aria-live="polite" role="status" class="visually-hidden">
        ${this.suggestedOptions.length} results available.
      </div>
    `;
  }

  updated() {
    const selectedLi = this.shadowRoot.querySelector("li.selected");
    if (selectedLi instanceof HTMLElement) {
      selectedLi.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  _handleFocus() {
    this.isOpen = true;
  }

  _handleInput(event) {
    this.isOpen = true;
    this.selectedIndex = 0;
    this.value = event.target.value;
  }

  _handleKeydown(event) {
    switch (event.keyCode) {
      case keyCodes.tab:
        this.isOpen = false;
        break;
      case keyCodes.down:
        event.preventDefault();
        this.selectedIndex += 1;
        break;
      case keyCodes.up:
        event.preventDefault();
        this.selectedIndex -= 1;
        break;
      case keyCodes.return:
        this.dispatchSubmit();
        break;
    }
  }

  _handleMouseenter(event) {
    this.selectedIndex = event.target.dataset.index;
  }

  _handleDocumentClick(event) {
    if (!this.contains(event.target)) {
      this.isOpen = false;
    }
  }

  async getOptions() {
    if (typeof this.dataset.src === "string") {
      const response = await fetch(this.dataset.src);
      const result = await response.json();
      this.options = result.options;
    }
  }

  async getSuggestedOptions() {
    this.suggestedOptions = this.options
      .filter((option) => {
        return (
          option.title.toLowerCase().includes(this.value) &&
          this.value.trim().length > 0
        );
      })
      .sort((a, b) => (a.title > b.title ? 1 : -1));
  }

  dispatchSubmit() {
    const event = new CustomEvent("search-options-submit", {
      bubbles: true,
      cancelable: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define("search-input", SearchInput);

class SearchForm extends HTMLFormElement {
  constructor() {
    super();
    this.addEventListener("search-options-submit", () => {
      this.submit();
    });
    this.addEventListener("submit", (event) => {
      event.preventDefault();
      this.submit();
    });
  }

  submit() {
    console.log("submit");
    const inputElement = this.querySelector("search-input");
    window.location.href = inputElement.selectedOption.url;
  }
}

customElements.define("search-form", SearchForm, {
  extends: "form",
});
