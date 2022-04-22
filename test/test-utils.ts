import { oneEvent } from '@open-wc/testing';
import { FileUpload } from '../src/FileUpload.js';
import { Files } from '../src/types.js';

export function dataTransferFromFiles(files: Files): DataTransfer {
  const transfer = new DataTransfer();
  Array.prototype.forEach.call(files, file => transfer.items.add(file));
  return transfer;
}

export function dataTransferFromFile(file: File): DataTransfer {
  return dataTransferFromFiles([file]);
}

export async function dispatchDropTo(
  el: FileUpload,
  dataTransfer: DataTransfer
) {
  const waitForAttached = oneEvent(el, 'ff-attached');
  el.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer }));
  await waitForAttached;
}
