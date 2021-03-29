import {
  LitElement,
  html,
  css,
} from "https://cdn.skypack.dev/lit-element@2.4.0";

const keyCodes = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  return: 13,
  tab: 9,
};

function clamp(min, max, value) {
  return Math.max(Math.min(value, max), min);
}

class SearchOptions extends LitElement {
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
    this.suggestedOptions = this.options
      .filter((option) => {
        return (
          option.title.toLowerCase().includes(this.value) &&
          this.value.trim().length > 0
        );
      })
      .sort((a, b) => (a.title > b.title ? 1 : -1));
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
    div {
      position: relative;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      position: absolute;
      top: 100%;
      left: 0;
      max-height: 20rem;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      border: solid 1px var(--gray);
    }
    li {
      padding: 0.5rem;
      background: var(--white);
    }
    li + li {
      border-top: solid 1px var(--gray);
    }
    li.selected {
      background: var(--lightest-blue);
    }
    .hidden {
      display: none;
    }
  `;

  render() {
    return html`
      <link href="/assets/css/reset.css" rel="stylesheet" />
      <link href="/assets/css/main.css" rel="stylesheet" />
      <div>
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
          placeholder="Search for an article"
        />
        <ul role="listbox" class="${this.isOpen ? "" : "hidden"}">
          ${this.suggestedOptions.map(
            (option, i) =>
              html` <li
                role="option"
                tabindex="-1"
                class="${this._selectedIndex === i ? "selected" : "none"}"
              >
                ${option.title}
              </li>`
          )}
        </ul>
        <div aria-live="polite" role="status" class="visually-hidden">
          ${this.suggestedOptions.length} results available.
        </div>
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
    this.value = event.target.value;
  }

  _handleKeydown(event) {
    switch (event.keyCode) {
      case keyCodes.tab:
        this.isOpen = false;
        break;
      case keyCodes.down:
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

customElements.define("search-options", SearchOptions);

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
    const optionsElement = this.querySelector("search-options");
    window.location.href = optionsElement.selectedOption.url;
  }
}

customElements.define("search-form", SearchForm, {
  extends: "form",
});
