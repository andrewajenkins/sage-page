import { test, expect } from '@playwright/test';
import { FileTreePanel } from './support/file-tree-toolbar.panel';

test('creates interactive folder', async ({ page }) => {
  const fileTree = new FileTreePanel(page);
  await fileTree.goto();
  await fileTree.hamburgerButton.click();
  await fileTree.createFolder('Folder1');
  const folderElement = fileTree.folderButton('Folder1');
  await expect(folderElement).toBeVisible();
  expect(await fileTree.toBeWhite(folderElement)).toBe(true);
  await folderElement.click();
  expect(await fileTree.toBeWhiteSmoke(folderElement)).toBe(true);
});

test('creates interactive file', async ({ page }) => {
  const fileTree = new FileTreePanel(page);
  await fileTree.goto();
  await fileTree.hamburgerButton.click();
  await fileTree.createFile('File1');
  const fileElement = fileTree.fileButton('File1');
  await expect(fileElement).toBeVisible();
  expect(await fileTree.toBeWhite(fileElement)).toBe(true);
  await fileElement.click();
  expect(await fileTree.toBeWhiteSmoke(fileElement)).toBe(true);
});
