import { Files } from './types.js';

export class FileContainer extends DataTransfer {
  constructor(files?: Files) {
    super();
    if (files) this.appendFiles(files);
  }

  appendDataTransfer(dataTransfer: DataTransfer): void {
    this.appendFiles(dataTransfer.files);
  }

  appendFiles(files: Files): void {
    Array.prototype.forEach.call(files, file => this.items.add(file));
  }
}
