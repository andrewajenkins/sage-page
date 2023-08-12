import { ContentSection } from '../../main-content/bot-window/bot-window.component';

export enum EditorAction {
  SAVE,
  UNDO,
  REDO,
  SELECT_ALL,
  DELETE_SELECTED,
  TOGGLE_HIGHLIGHT,
  NONE,
}

export enum NodeAction {
  CREATE_FOLDER,
  CREATE_FILE,
  EDIT_NODE_NAME,
  DELETE_NODE,
  SAVE_FILE,
  LOAD_FILE,
  ADD_CONTENT,
  CREATE_SUBSECTION,
}

export interface Command<T> {
  action: T;
  id?: number;
  value?: string;
  contents?: ContentSection[];
  content?: ContentSection;
  flag?: boolean;
}

// export interface ValueCommand extends Command<> {
//   value?: string;
// }
