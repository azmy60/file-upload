import { html } from 'lit';
import { fixture, assert, oneEvent } from '@open-wc/testing';
import { FileUpload } from '../src/FileUpload.js';
import '../src/file-upload.js';

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

  describe('files', () => {
    let el: FileUpload;
    let dataTransfer: DataTransfer;
    let waitForAttached: Promise<CustomEvent>;
    const file1 = new File(['watermelon'], 'watermelon.txt', {
      type: 'text/plain',
    });
    const file2 = new File(['watermelon2'], 'watermelon2.txt', {
      type: 'text/plain',
    });

    beforeEach(async () => {
      el = await fixture<FileUpload>(html`<file-upload></file-upload>`);
      dataTransfer = new DataTransfer();
      waitForAttached = oneEvent(el, 'ff-attached');
    });

    it('attaches via .attach', async () => {
      dataTransfer.items.add(file1);
      await el.attach(dataTransfer);

      assert.equal(el.input.files?.length, 1);
    });

    it('attaches via drop event', async () => {
      dataTransfer.items.add(file1);

      const dropEvent = new DragEvent('drop', { bubbles: true, dataTransfer });
      el.dispatchEvent(dropEvent);

      const { detail } = await waitForAttached;
      assert.equal(detail.files.length, 1);
    });

    it('throws error when attaching multiple files to non-multiple', async () => {
      dataTransfer.items.add(file1);
      dataTransfer.items.add(file2);

      return el
        .attach(dataTransfer)
        .catch(err =>
          assert.equal(
            err.message,
            'Cannot attach multiple files to non-multiple input.'
          )
        );
    });

    it('ignores multiple files when dropping multiple files to non-multiple', async () => {
      dataTransfer.items.add(file1);
      dataTransfer.items.add(file2);

      const dropEvent = new DragEvent('drop', { bubbles: true, dataTransfer });
      el.dispatchEvent(dropEvent);

      const { detail } = await waitForAttached;
      assert.equal(detail.files.length, 0);
    });
  });
});
