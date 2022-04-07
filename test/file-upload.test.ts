import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { FileUpload } from '../src/FileUpload.js';
import '../src/file-upload.js';

describe('FileUpload', () => {
  describe('<input> element insertion', () => {
    it('inserts <input> by default', async () => {
      const el = await fixture<FileUpload>(html`<file-upload></file-upload>`);

      expect(el.input).to.be.ok;
    });

    it("does not insert <input> if it's already specified", async () => {
      const el = await fixture<FileUpload>(
        html`<file-upload><input type="file" id="test-id" /></file-upload>`
      );

      expect(el.input.id).to.equal('test-id');
    });
  });

  describe('attribute settings', () => {
    describe('`multiple`', () => {
      it('accepts one file by default', async () => {
        const el = await fixture<FileUpload>(html`<file-upload></file-upload>`);

        expect(el.input.multiple).to.be.false;
      });

      it('accepts multiple files by setting `multiple` attribute in <file-upload> tag', async () => {
        const el = await fixture<FileUpload>(
          html`<file-upload multiple><input type="file" /></file-upload>`
        );

        expect(el.input.multiple).to.be.true;
      });

      it('accepts multiple files by setting `multiple` attribute in <input> tag', async () => {
        const el = await fixture<FileUpload>(
          html`<file-upload><input type="file" multiple /></file-upload>`
        );

        expect(el.input.multiple).to.be.true;
      });
    });
  });

  describe('attaching files', () => {
    it('via .attach', async () => {
      const el = await fixture<FileUpload>(html`<file-upload></file-upload>`);

      const dataTransfer = new DataTransfer();
      const file = new File(['watermelon'], 'watermelon.txt', {
        type: 'text/plain',
      });
      dataTransfer.items.add(file);

      el.attach(dataTransfer);
      if (!el.input.files) throw new Error('No files');

      const attachedFileName = el.input.files[0].name;
      expect(attachedFileName).to.equal('watermelon.txt');
    });
  });
});
