import { html, LitElement } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';

export class FileUpload extends LitElement {
  @property({ type: Boolean }) multiple = false;

  @queryAssignedElements({ flatten: true }) inputs!: Array<HTMLInputElement>;

  render() {
    return html`<slot><input type="file" class="__fu-fallback" /></slot>`;
  }

  firstUpdated() {
    if (this.input.classList.contains('__fu-fallback')) {
      this.input.multiple = this.multiple;
    } else {
      this.input.multiple = this.input.multiple || this.multiple;
    }
  }

  attach(dataTransfer: DataTransfer) {
    this.input.files = dataTransfer.files;
  }

  get input() {
    return this.inputs[0];
  }
}
