import { html, LitElement, TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { hasFile, emptyFileList, filesFromAttachment } from './utils.js';
import { FileContainer } from './FileContainer.js';
import { Attachment } from './types.js';

export class FileUpload extends LitElement {
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

    event.preventDefault();
    event.stopPropagation();

    this.attach(dataTransfer);
    this.dispatchAttached();
  }

  public attach(attachment: Attachment): void {
    const files = filesFromAttachment(attachment);

    if (!this.input.multiple && files.length > 1) {
      throw new Error('Cannot attach multiple files to non-multiple input.');
    }

    const fileContainer = new FileContainer(this.files);
    fileContainer.appendFiles(files);
    this.setInputFiles(fileContainer);
  }

  // TODO use strongly typed custom event
  private dispatchAttached(): void {
    this.dispatchEvent(new CustomEvent('ff-attached', { bubbles: true }));
  }

  private setInputFiles(dataTransfer: DataTransfer): void {
    this.input.files = dataTransfer.files;
  }

  public get files(): FileList {
    return this.input.files ?? emptyFileList();
  }

  public get input(): HTMLInputElement {
    return this.inputs[0];
  }

  @queryAssignedElements({ flatten: true })
  private inputs!: Array<HTMLInputElement>;

  @property({ type: Boolean })
  public multiple = false;

  protected render(): TemplateResult {
    return html`<slot><input type="file" /></slot>`;
  }

  protected firstUpdated(): void {
    if (this.multiple) this.input.multiple = true;
  }
}
