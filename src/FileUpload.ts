import { html, LitElement, TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { hasFile, emptyFileList } from './utils.js';
import { FileContainer } from './FileContainer.js';

export interface FileUploadDetail {
  files: FileList;
}

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

    try {
      this.attach(dataTransfer);
    } catch (e) {
      //
    }
  }

  public attach(dataTransfer: DataTransfer): void {
    if (!this.input.multiple && dataTransfer.files.length > 1) {
      this.dispatchAttached({ files: emptyFileList() });
      throw new Error('Cannot attach multiple files to non-multiple input.');
    }

    const fileContainer = new FileContainer(this.files);
    fileContainer.appendDataTransfer(dataTransfer);
    this.setInputFiles(fileContainer);

    this.dispatchAttached({ files: this.files });
  }

  // TODO use strongly typed custom event
  private dispatchAttached(detail: FileUploadDetail): void {
    const event = new CustomEvent<FileUploadDetail>('ff-attached', {
      bubbles: true,
      detail,
    });
    this.dispatchEvent(event);
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
