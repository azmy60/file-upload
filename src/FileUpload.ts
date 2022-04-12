import { html, LitElement, TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { hasFile } from './utils.js';

export class FileUpload extends LitElement {
  private pendingFiles: FileList = new DataTransfer().files;

  public connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('drop', this.onDrop);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener('drop', this.onDrop);
  }

  public onDrop(event: DragEvent): void {
    const { dataTransfer } = event;
    if (!dataTransfer || !hasFile(dataTransfer)) return;

    this.attach(dataTransfer).catch(() => {});

    event.preventDefault();
    event.stopPropagation();
  }

  public async attach(dataTransfer: DataTransfer): Promise<void> {
    this.pendingFiles = dataTransfer.files;

    return new Promise<void>((resolve, reject) =>
      this.validate()
        .then(() => {
          this.attachFilesToInput();
          resolve();
        })
        .catch(reject)
        .finally(() => this.dispatchAttached())
    );
  }

  private async validate(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.input.multiple && this.pendingFiles.length > 1) {
        reject(
          new Error('Cannot attach multiple files to non-multiple input.')
        );
      } else resolve();
    });
  }

  private attachFilesToInput(): void {
    this.input.files = this.pendingFiles;
  }

  private dispatchAttached(): void {
    this.dispatchEvent(
      new CustomEvent('ff-attached', {
        bubbles: true,
        detail: { files: this.input.files },
      })
    );
  }

  public get input(): HTMLInputElement {
    return this.inputs[0];
  }

  @queryAssignedElements({ flatten: true })
  private inputs!: Array<HTMLInputElement>;

  @property({ type: Boolean }) multiple = false;

  protected render(): TemplateResult {
    return html`<slot><input type="file" /></slot>`;
  }

  protected firstUpdated(): void {
    if (this.multiple) this.input.multiple = true;
  }
}
