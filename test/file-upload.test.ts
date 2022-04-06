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
      const inputId = el.input.id;
      expect(inputId).to.equal('test-id');
    });
  });
});
