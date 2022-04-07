import { html, LitElement } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { hasFile } from './utils.js';

export class FileUpload extends LitElement {
  @property({ type: Boolean }) multiple = false;

  @queryAssignedElements({ flatten: true }) inputs!: Array<HTMLInputElement>;

  render() {
    return html`<slot><input type="file" class="__fu-fallback" /></slot>`;
  }

  public connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('drop', this.onDrop);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener('drop', this.onDrop);
  }

  firstUpdated() {
    if (this.input.classList.contains('__fu-fallback')) {
      this.input.multiple = this.multiple;
    } else {
      this.input.multiple = this.input.multiple || this.multiple;
    }
  }

  public onDrop(event: DragEvent): void {
    const transfer = event.dataTransfer;
    if (!transfer || !hasFile(transfer)) return;

    this.attach(transfer);

    event.preventDefault();
    event.stopPropagation();
  }

  attach(dataTransfer: DataTransfer) {
    this.input.files = dataTransfer.files;
    this.dispatchEvent(new CustomEvent('ff-attached', { bubbles: true }));
  }

  get input() {
    return this.inputs[0];
  }
}
