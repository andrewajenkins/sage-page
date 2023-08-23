import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ServiceLogger } from '../logger/loggers';
import { FileTreeFile, FileTreeFolder, FileTreeNode, isFile } from '../models/file-tree.model';
import { ChatLogEntry, ContentSection, isSection } from '../models/section.model';
import { MatTreeService } from './mat-tree.service';
import { getDummyFile } from '../utils/node.factory';

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
  constructor(private http: HttpClient, private matTreeService: MatTreeService) {}

  getFileTree(): Observable<any> {
    return this.http.get<FileTreeNode[]>(url + '/filetree').pipe(this.matTreeService.assembleTree);
  }

  getNode(sub: number): Observable<FileTreeNode> {
    return this.http.get<ApiResponse>(url + '/node?id=' + sub).pipe(map((res) => res.node));
  }

  createNode(node: FileTreeNode) {
    return this.http
      .post<ApiResponse>(url + '/node', node)
      .pipe(
        map((response) => {
          console.log('done - createNode', response);
          return response.tree;
        })
      )
      .pipe(this.matTreeService.assembleTree);
  }

  createSection(node: FileTreeNode) {
    return this.http.post<ApiResponse>(url + '/node', node).pipe(
      map((response) => {
        console.log('done - createSection: id:', response.id);
        return response.id;
      })
    );
  }

  updateNode(node: FileTreeNode) {
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
    return this.http.put<FileTreeNode[]>(url + '/node', updateNode);
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
      .pipe(this.matTreeService.assembleTree);
  }

  saveContent(contents: ContentSection[]) {
    return this.http.post<ApiResponse>(url + '/content', contents);
  }

  getFile(fileID: number): Observable<FileTreeFile> {
    return this.getNode(fileID).pipe(
      map((newNode) => {
        if (isFile(newNode)) {
          newNode.sections = [];
          return newNode;
        } else return getDummyFile();
      })
    );
  }

  getFolder(folderID: number): Observable<FileTreeFolder> {
    return this.getNode(folderID) as Observable<FileTreeFolder>;
  }

  saveConversation(log: ChatLogEntry[]) {
    return this.http.post<ApiResponse>(url + '/conversation', log);
  }

  createSections(contentSections: ContentSection[]) {
    return this.http.post<ApiResponse>(url + '/nodes', contentSections);
  }
}
