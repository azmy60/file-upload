import { html } from 'lit';
import { fixture, assert } from '@open-wc/testing';
import { FileUpload } from '../src/FileUpload.js';
import '../src/file-upload.js';
import {
  dataTransferFromFile,
  dataTransferFromFiles,
  dispatchDropTo,
} from './test-utils.js';

describe('FileUpload', () => {
  describe('<input> element insertion', () => {
    it('inserts <input> by default', async () => {
      const el = await fixture<FileUpload>(html`<file-upload></file-upload>`);

      assert.isOk(el.input);
    });

    it("does not insert <input> if it's already specified", async () => {
      const el = await fixture<FileUpload>(
        html`<file-upload><input type="file" id="test-id" /></file-upload>`
      );

      assert.equal(el.input.id, 'test-id');
    });
  });

  describe('attribute settings', () => {
    describe('`multiple`', () => {
      it('accepts one file by default', async () => {
        const el = await fixture<FileUpload>(html`<file-upload></file-upload>`);

        assert.isFalse(el.input.multiple);
      });

      it('accepts multiple files by setting `multiple` attribute in <file-upload> tag', async () => {
        const el = await fixture<FileUpload>(
          html`<file-upload multiple><input type="file" /></file-upload>`
        );

        assert.isTrue(el.input.multiple);
      });

      it('accepts multiple files by setting `multiple` attribute in <input> tag', async () => {
        const el = await fixture<FileUpload>(
          html`<file-upload><input type="file" multiple /></file-upload>`
        );

        assert.isTrue(el.input.multiple);
      });
    });
  });

  let el: FileUpload;

  const testFiles = [
    new File(['watermelon'], 'watermelon.txt', {
      type: 'text/plain',
    }),
    new File(['watermelon2'], 'watermelon2.txt', {
      type: 'text/plain',
    }),
  ];

  describe('`non-multiple` input', () => {
    beforeEach(async () => {
      el = await fixture<FileUpload>(html`<file-upload></file-upload>`);
    });

    it('attaches via .attach', () => {
      el.attach(testFiles[0]);
      assert.equal(el.files.length, 1);
    });

    it('attaches via drop event', async () => {
      await dispatchDropTo(el, dataTransferFromFile(testFiles[0]));
      assert.equal(el.files.length, 1);
    });

    it('throws error when attaching multiple files via .attach', () => {
      assert.throws(() => el.attach(testFiles));
    });
  });

  describe('`multiple` input', () => {
    beforeEach(async () => {
      el = await fixture<FileUpload>(
        html`<file-upload multiple></file-upload>`
      );
    });

    it('can attach multiple files', async () => {
      const dt = dataTransferFromFiles(testFiles);
      await dispatchDropTo(el, dt);
      assert.deepEqual(el.files, dt.files);
    });

    it('should stack the files when attaching multiple times', async () => {
      const dtFile0File1 = dataTransferFromFiles(testFiles);
      const dtFile0 = dataTransferFromFile(testFiles[0]);
      const dtFile1 = dataTransferFromFile(testFiles[1]);

      await dispatchDropTo(el, dtFile0);
      await dispatchDropTo(el, dtFile1);
      assert.deepEqual(el.files, dtFile0File1.files);
    });
  });
});
