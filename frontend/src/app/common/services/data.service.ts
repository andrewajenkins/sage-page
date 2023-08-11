import { Injectable } from '@angular/core';
import {
  FileTreeFile,
  FileTreeFolder,
  FileTreeNode,
  isFile,
  isFolder,
} from '../../file-tree-panel/file-tree/file-tree.component';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ServiceLogger } from '../logger/loggers';
import { ContentSection } from '../../main-content/bot-window/bot-window.component';

const url = 'http://localhost:4200/api';

export interface ApiResponse {
  id: number;
  tree: FileTreeNode[];
  node: FileTreeFile;
}

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class DataService {
  constructor(private http: HttpClient) {}

  getFileTree(): Observable<any> {
    return this.http
      .get<FileTreeNode[]>(url + '/filetree')
      .pipe(this.assembleTree);
  }

  getNode(sub: number): Observable<FileTreeNode> {
    return this.http
      .get<ApiResponse>(url + '/node?id=' + sub)
      .pipe(map((res) => res.node));
  }

  createNode(node: FileTreeNode) {
    return this.http
      .post<ApiResponse>(url + '/node', node)
      .pipe(
        map((response) => {
          console.log('setNode', response);
          return response.tree;
        })
      )
      .pipe(this.assembleTree);
  }

  deleteNode(node: FileTreeNode) {
    return this.http
      .delete<ApiResponse>(url + '/node?id=' + node.id + '&type=' + node.type, {
        body: {
          id: node.id,
        },
      })
      .pipe(
        map((response) => {
          console.log('deleteNode', response);
          return response.tree;
        })
      )
      .pipe(this.assembleTree);
  }

  saveContent(contents: ContentSection[]) {
    return this.http.post<ApiResponse>(url + '/content', contents);
  }

  getFile(fileID: number): Observable<FileTreeFile> {
    return this.getNode(fileID) as Observable<FileTreeFile>;
  }

  getFolder(folderID: number): Observable<FileTreeFolder> {
    return this.getNode(folderID) as Observable<FileTreeFolder>;
  }

  assembleTree = map((nodes: FileTreeNode[]) => {
    const debug = false;
    const nodeMap = new Map<number, FileTreeNode>();
    const rootNodes: FileTreeNode[] = [];
    console.log('assembleTree: nodes:', nodes);
    nodes.forEach((node) => {
      if (isFolder(node)) {
        node.subNodes = [];
      } else if (isFile(node)) {
        node.content = [];
      }
      nodeMap.set(node.id as number, node);
    });
    if (debug) console.log('assembleTree: map:', map);
    nodes.forEach((node) => {
      const findDebug = false;
      if (!node.parent_id) {
        if (findDebug)
          console.log('assembleTree: fine: pushing root node:', node);
        rootNodes.push(node);
      } else {
        console.log('assembleTree: fine: pushing subNode:', node);
        const parent = nodeMap.get(node.parent_id) as FileTreeFolder;
        parent.subNodes.push(node);
      }
    });
    console.log('assembleTree: final tree:', rootNodes);
    return rootNodes;
  });
}
