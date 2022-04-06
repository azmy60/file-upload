import { html, LitElement } from 'lit';
import { queryAssignedElements } from 'lit/decorators.js';

export class FileUpload extends LitElement {
  @queryAssignedElements({ flatten: true })
  inputs!: Array<HTMLInputElement>;

  get input() {
    return this.inputs[0];
  }

  render() {
    return html`<slot><input type="file" /></slot>`;
  }
}
