export function hasFile(transfer: DataTransfer): Boolean {
  return transfer.files.length > 0;
}

export function emptyFileList(): FileList {
  return new DataTransfer().files;
}
