import { test, expect } from '@playwright/test';
import { FileTreePanel } from './support/file-tree-toolbar.panel';

test.beforeEach(async ({ page }) => {
  const fileTree = new FileTreePanel(page);
  await fileTree.goto();
  await fileTree.hamburgerButton.click();
  await fileTree.createFolder('Folder1');
  await fileTree.folderButton('Folder1').click();
  await fileTree.createFolder('Folder2');
  await fileTree.createFolder('Folder3');
  await fileTree.createFile('File1');
  await fileTree.createFile('File2');
  await fileTree.folderButton('Folder2').click();
  await fileTree.createFolder('Folder4');
  await fileTree.folderButton('Folder4').click();
  await fileTree.createFile('File3');
  await fileTree.createFolder('Folder5');
});

test('verify files/folders visible', async ({ page }) => {
  const fileTree = new FileTreePanel(page);
  await expect(fileTree.folderButton('Folder1')).toBeVisible();
  await expect(fileTree.folderButton('Folder2')).toBeVisible();
  await expect(fileTree.folderButton('Folder3')).toBeVisible();
  await expect(fileTree.folderButton('Folder4')).toBeVisible();
  await expect(fileTree.folderButton('Folder5')).toBeVisible();
  await expect(fileTree.fileButton('File1')).toBeVisible();
  await expect(fileTree.fileButton('File2')).toBeVisible();
  await expect(fileTree.fileButton('File3')).toBeVisible();
});

test('verify tree heirarchy', async ({ page }) => {
  const fileTree = new FileTreePanel(page);
  expect(await fileTree.hasParent('Folder1', 'Folder2')).toBe(true);
  expect(await fileTree.hasParent('Folder1', 'Folder3')).toBe(true);
  expect(await fileTree.hasParent('Folder1', 'File1')).toBe(true);
  expect(await fileTree.hasParent('Folder1', 'File2')).toBe(true);
  expect(await fileTree.hasParent('Folder2', 'Folder4')).toBe(true);
  expect(await fileTree.hasParent('Folder4', 'Folder5')).toBe(true);
  expect(await fileTree.hasParent('Folder4', 'File3')).toBe(true);
  expect(await fileTree.hasParent('Folder2', 'Folder1')).toBe(false);
});

test('verify unhighlighting', async ({ page }) => {
  const fileTree = new FileTreePanel(page);
  expect(await fileTree.toBeWhite(fileTree.folderButton('Folder1'))).toBe(true);
  await fileTree.folderButton('Folder1').click();
  expect(await fileTree.toBeWhite(fileTree.folderButton('Folder2'))).toBe(true);
  expect(await fileTree.toBeWhite(fileTree.folderButton('Folder3'))).toBe(true);
  expect(await fileTree.toBeWhite(fileTree.folderButton('Folder4'))).toBe(true);
  expect(await fileTree.toBeWhite(fileTree.folderButton('Folder5'))).toBe(true);
  expect(await fileTree.toBeWhite(fileTree.fileButton('File1'))).toBe(true);
  expect(await fileTree.toBeWhite(fileTree.fileButton('File2'))).toBe(true);
  expect(await fileTree.toBeWhite(fileTree.fileButton('File3'))).toBe(true);
});

test('verify node selected color', async ({ page }) => {
  const fileTree = new FileTreePanel(page);
  await fileTree.folderButton('Folder1').click();
  expect(await fileTree.toBeWhiteSmoke(fileTree.folderButton('Folder1'))).toBe(true);
  await fileTree.folderButton('Folder2').click();
  expect(await fileTree.toBeWhiteSmoke(fileTree.folderButton('Folder2'))).toBe(true);
  await fileTree.folderButton('Folder3').click();
  expect(await fileTree.toBeWhiteSmoke(fileTree.folderButton('Folder3'))).toBe(true);
  await fileTree.folderButton('Folder4').click();
  expect(await fileTree.toBeWhiteSmoke(fileTree.folderButton('Folder4'))).toBe(true);
  await fileTree.folderButton('Folder5').click();
  expect(await fileTree.toBeWhiteSmoke(fileTree.folderButton('Folder5'))).toBe(true);
  await fileTree.fileButton('File1').click();
  expect(await fileTree.toBeWhiteSmoke(fileTree.fileButton('File1'))).toBe(true);
  await fileTree.fileButton('File2').click();
  expect(await fileTree.toBeWhiteSmoke(fileTree.fileButton('File2'))).toBe(true);
  await fileTree.fileButton('File3').click();
  expect(await fileTree.toBeWhiteSmoke(fileTree.fileButton('File3'))).toBe(true);
});
