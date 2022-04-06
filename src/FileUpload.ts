import { html, LitElement } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';

export class FileUpload extends LitElement {
  @property({ type: Boolean }) multiple = false;

  @queryAssignedElements({ flatten: true })
  inputs!: Array<HTMLInputElement>;

  get input() {
    return this.inputs[0];
  }

  render() {
    return html`<slot><input type="file" class="fallback-input" /></slot>`;
  }

  firstUpdated() {
    if (this.input.classList.contains('fallback-input')) {
      this.input.multiple = this.multiple;
    } else {
      this.input.multiple = this.input.multiple || this.multiple;
    }
  }
}
