import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export const timeout = 5000;

export class FileTreePanel {
  readonly createFolderButton!: (name) => Locator;
  readonly createFileButton: (name) => Locator;
  readonly nodeNameInput!: Locator;
  readonly nodeNameSubmitButton!: Locator;
  readonly hamburgerButton!: Locator;
  readonly fileButton!: (name) => Locator;
  readonly folderButton!: (name) => Locator;

  constructor(public readonly page: Page) {
    page.setDefaultTimeout(timeout);
    this.createFolderButton = (name) =>
      this.page.locator('[auto="create-folder"]');
    this.createFileButton = (name) => this.page.locator('[auto="create-file"]');
    this.nodeNameInput = page.locator('[auto="node-name"]');
    this.nodeNameSubmitButton = page.locator('[auto="submit-node-name"]');
    this.hamburgerButton = page.locator('mat-toolbar button.hamburger');
    this.fileButton = (name) =>
      this.page.locator('[auto="file-name"][name="' + name + '"]');
    this.folderButton = (name) =>
      this.page.locator('[auto="folder-name"][name="' + name + '"]');
  }

  async goto() {
    await this.page.goto('localhost:4200');
  }

  async createFolder(name) {
    this.page.pause();
    await this.createFolderButton(name).click();
    await this.nameNode(name);
  }

  async createFile(name) {
    await this.createFileButton(name).click();
    await this.nameNode(name);
  }

  async nameNode(name) {
    await this.nodeNameInput.type(name);
    await this.nodeNameSubmitButton.click();
    await expect(this.nodeNameInput).toHaveCount(0);
  }

  async hasParent(parent, child) {
    return this.page
      .locator(
        `.mat-tree-node[name="${parent}"] + div .mat-tree-node[name="${child}"]`
      )
      .isVisible();
  }

  async toBeWhite(element) {
    let color = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    return color === 'rgba(0, 0, 0, 0)';
  }

  async toBeHighlighted(element) {
    console.log('element:', await element.getByText());
    await this.wait(async () => {
      // await this.page.pause();
      let color = await element.evaluate(async (el) => {
        // await this.page.pause();
        return window.getComputedStyle(el).getPropertyValue('background-color');
      });
      return color === 'rgb(224, 224, 224)';
    });
  }

  async toBeWhiteSmoke(element) {
    let color = await element.evaluate(async (el) => {
      return window.getComputedStyle(el).getPropertyValue('background-color');
    });
    return color === 'rgb(224, 224, 224)';
  }

  wait = async (func: () => Promise<boolean>) => {
    // await this.page.pause();
    let localTimeout = timeout;
    while (localTimeout > 0) {
      // await this.page.pause();
      if (await func()) {
        return true;
      }
      // await this.page.pause();
      await this.page.waitForTimeout(localTimeout);
      localTimeout -= 1000;
    }
    return false;
  };
}
