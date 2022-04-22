import { Attachment, Files } from './types.js';

export function hasFile(transfer: DataTransfer): Boolean {
  return transfer.files.length > 0;
}

export function emptyFileList(): FileList {
  return new DataTransfer().files;
}

export function filesFromAttachment(attachment: Attachment): Files {
  let files = attachment; // is Files
  if ('files' in attachment) files = attachment.files; // is DataTransfer
  else if ('name' in attachment) files = [attachment]; // is File
  return files as Files;
}
