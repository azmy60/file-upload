import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
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

  describe('files', () => {
    it('attaches via .attach', async () => {
      const el = await fixture<FileUpload>(html`<file-upload></file-upload>`);

      const dataTransfer = new DataTransfer();
      const file = new File(['watermelon'], 'watermelon.txt', {
        type: 'text/plain',
      });
      dataTransfer.items.add(file);

      const waitForAttached = oneEvent(
        el,
        'ff-attached'
      ) as Promise<CustomEvent>;
      el.attach(dataTransfer);
      const { detail } = await waitForAttached;

      expect(detail.files.length).to.equal(1);
    });

    it('attaches via drop event', async () => {
      const el = await fixture<FileUpload>(html`<file-upload></file-upload>`);

      const dataTransfer = new DataTransfer();
      const file = new File(['watermelon'], 'watermelon.txt', {
        type: 'text/plain',
      });
      dataTransfer.items.add(file);

      const waitForAttached = oneEvent(
        el,
        'ff-attached'
      ) as Promise<CustomEvent>;
      const dropEvent = new DragEvent('drop', { bubbles: true, dataTransfer });
      el.dispatchEvent(dropEvent);
      const { detail } = await waitForAttached;

      expect(detail.files.length).to.equal(1);
    });

    it('should not attach multiple files to non-multiple', async () => {
      const el = await fixture<FileUpload>(html`<file-upload></file-upload>`);

      const dataTransfer = new DataTransfer();
      const files = [
        new File(['watermelon'], 'watermelon.txt', {
          type: 'text/plain',
        }),
        new File(['watermelon2'], 'watermelon2.txt', {
          type: 'text/plain',
        }),
      ];
      files.forEach(file => dataTransfer.items.add(file));

      expect(el.attach.bind(el, dataTransfer)).to.throw(
        'Cannot attach multiple files to non-multiple input.'
      );
    });
  });
});
