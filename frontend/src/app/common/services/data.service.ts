import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ServiceLogger } from '../logger/loggers';
import { isFile } from '../models/file-tree.model';
import { ChatLogEntry, ContentNode, isSection } from '../models/section.model';
import { getDummyFile } from '../utils/node.factory';

const url = 'http://localhost:4200/api';

// export interface ApiResponse {
//   id: number;
//   tree: FileTreeNode[];
//   node: FileTreeFile;
// }
//
@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class DataService {
  constructor(private http: HttpClient) {}

  getFileTree(): Observable<any> {
    return this.http.get<ContentNode[]>(url + '/filetree');
  }

  getNode(sub: number): Observable<ContentNode> {
    return this.http.get<ContentNode>(url + '/node?id=' + sub);
  }

  createNode(node: ContentNode) {
    return this.http.post<ContentNode[]>(url + '/node', node);
  }

  createSection(node: ContentNode) {
    return this.http.post<ContentNode>(url + '/node', node).pipe(
      map((response) => {
        console.log('done - createSection: id:', response.id);
        return response.id;
      })
    );
  }

  updateNode(node: ContentNode) {
    const updateNode = {
      id: node.id,
      name: node.name,
      parent_id: node.parent_id,
      type: node.type,
    };
    if (isFile(node) || isSection(node)) {
      updateNode['text'] = node.text;
    }
    console.log('UPDATE_NODE:', updateNode);
    return this.http.put<ContentNode[]>(url + '/node', updateNode);
  }

  deleteNode(node: ContentNode) {
    return this.http.delete<ContentNode[]>(url + '/node?id=' + node.id + '&type=' + node.type, {
      body: {
        id: node.id,
      },
    });
  }

  saveContent(contents: ContentNode[]) {
    return this.http.post<ContentNode[]>(url + '/content', contents);
  }

  getFile(fileID: number): Observable<ContentNode> {
    return this.getNode(fileID).pipe(
      map((newNode) => {
        if (isFile(newNode)) {
          newNode.sections = [];
          return newNode;
        } else return getDummyFile();
      })
    );
  }

  getFolder(folderID: number): Observable<ContentNode> {
    return this.getNode(folderID) as Observable<ContentNode>;
  }

  saveConversation(log: ChatLogEntry[]) {
    return this.http.post<ContentNode[]>(url + '/conversation', log);
  }

  createSections(contentSection: ContentNode) {
    return this.http.post<ContentNode[]>(url + '/nodes', contentSection);
  }
}
