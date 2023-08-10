import { FileTreeFolder, FileTreeNode, isFolder } from './file-tree.component';

// export function findInTree(tree: FileTreeNode[], key: string): any {
//   tree.forEach((node: FileTreeNode) => {
//     console.log('findInTree: comparing expected', node.uid, 'actual', key);
//     if (isFolder(node) && node.uid === key) {
//       console.log('findInTree: found!', node.uid, node);
//       return node;
//     } else if (isFolder(node) && node.subNodes) {
//       const result = findInTree(node.subNodes, key);
//       if (result) {
//         return result;
//       }
//     }
//     return {} as FileTreeFolder;
//   });
// }
