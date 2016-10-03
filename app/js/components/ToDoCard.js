/**
 * Custom element ToDoCard.
 *
 * This custom element encapsulates all the layout and style to display a ToDoCard.
 *
 * The consumer of this custom element is able to create a ToDoCard with the following HTML tag:
 * <to-do-card></to-do-card>
 *
 * This custom element includes the following optional attributes:
 * - identifier
 * - header
 * - text
 * - footer
 *
 * The attribute values can be specified within the attributes of the HTML tag:
 *  <to-do-card identifier="0" header="Title" text="Testing custom elements." footer="mail@test.com"></to-do-card>
 *
 * and also using JavaScript:
 *  let toDoCard = new ToDoCardElement();
 *  toDoCard.className = "card";
 *  toDoCard.setAttribute('identifier', '0');
 *  toDoCard.setAttribute('text', 'Title');
 *  toDoCard.setAttribute('header', 'Testing custom elements.');
 *  toDoCard.setAttribute('footer', 'mail@test.com');
 *
 * @extends HTMLElement
 */
class ToDoCard extends HTMLElement {
  /**
   * Use the to-do-card-template and inject it in the component.
   * If the browser supports Shadow DOM inject the template in the shadow root of the element.
   * If the browser does not support Shadow DOM inject the template as a child of the component.
   */
  initTemplate(){
    let template = document.getElementById('to-do-card-template').content.cloneNode(true);

    // Check the support for Shadow DOM
    if (typeof this.attachShadow === 'function') {
      let shadowRoot = this.attachShadow({mode: 'closed'});
      shadowRoot.appendChild(template);
      this.identifierNode = shadowRoot.querySelector('.identifier');
      this.headerNode = shadowRoot.querySelector('.header');
      this.textNode = shadowRoot.querySelector('.text');
      this.footerNode = shadowRoot.querySelector('.footer');
    } else {
      this.appendChild(template);
      this.identifierNode = this.querySelector('.identifier');
      this.headerNode = this.querySelector('.header');
      this.textNode = this.querySelector('.text');
      this.footerNode = this.querySelector('.footer');
    }

    this.templateCreated = true;
  }
  /**
   * Updates the content of the render with the values of the attributes.
   */
  renderTemplate(){
    // Ensure the template has been created.
    if (this.templateCreated === true) {
      // Check if the card attributes contain values and update the template.
      this.identifierNode.textContent = typeof this.attributes.identifier === 'object' ? `#${this.attributes.identifier.value}` : '';
      this.headerNode.textContent = typeof this.attributes.header === 'object' ? this.attributes.header.value : '';
      this.textNode.textContent = typeof this.attributes.text === 'object' ? this.attributes.text.value : '';
      this.footerNode.textContent = typeof this.attributes.footer === 'object' ? this.attributes.footer.value : '';
    }
  }
  /**
   * Part of any Custom Element reactions.
   *
   * Executed when an instance was inserted into the document.
   * Useful for running setup code, such as fetching resources or rendering.
   * Generally, you should try to delay work until this time.
   *
   * TODO rename this method to connectedCallback when the spec change is implemented in the major browsers:
   * https://github.com/webcomponents/webcomponentsjs/issues/598
   */
  attachedCallback(){
    this.initTemplate();
    this.renderTemplate();
  };
  /**
   * Part of any Custom Element reactions.
   *
   * Executed when an attribute was added, removed, updated, or replaced.
   * Also called for initial values when an element is created by the parser, or upgraded.
   * Note: only attributes listed in the observedAttributes property will receive this callback.
   */
  attributeChangedCallback(attrName, oldVal, newVal){
    this.renderTemplate();
  }

  /**
   * Part of any Custom Element reactions.
   *
   * Executed when an instance of the element is created.
   */
  createdCallback(){
    this.templateCreated = false;
  }

  /**
   * Part of any Custom Element reactions.
   *
   * Executed when an instance of the element is created or upgraded.
   * See the spec for restrictions on what you can do in the constructor:
   * https://html.spec.whatwg.org/multipage/scripting.html#custom-element-conformance
   */
  constructor(){
    super();
  }
}

// Feature detection
if (typeof document.registerElement === 'function') {
  // Register our component and make it available on the global scope
  window.ToDoCardElement = document.registerElement("to-do-card", ToDoCard);
}
