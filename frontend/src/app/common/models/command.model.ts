import { ContentSection } from '../../main-content/bot-window/bot-window.component';
import { FileTreeNode } from './file-tree.model';

interface BaseCommand<TAction> {
  action: TAction;
}
export type BaseAction =
  | EditorAction
  | NodeAction
  | StateAction
  | ContentAction;
export enum EditorAction {
  SAVE = 'EDITOR_SAVE',
  UNDO = 'EDITOR_UNDO',
  REDO = 'EDITOR_REDO',
  SELECT_ALL = 'EDITOR_SELECT_ALL',
  DELETE_SELECTED = 'EDITOR_DELETE_SELECTED',
  TOGGLE_HIGHLIGHT = 'EDITOR_TOGGLE_HIGHLIGHT',
  NONE = 'EDITOR_NONE',
}
export enum NodeAction {
  CREATE_FOLDER = 'NODE_CREATE_FOLDER',
  CREATE_FILE = 'NODE_CREATE_FILE',
  EDIT_NODE_NAME = 'NODE_EDIT_NODE_NAME',
  DELETE_NODE = 'NODE_DELETE_NODE',
  SAVE_FILE = 'NODE_SAVE_FILE',
  LOAD_FILE = 'NODE_LOAD_FILE',
  ADD_CONTENT = 'NODE_ADD_CONTENT',
  CREATE_SUBSECTION = 'NODE_CREATE_SUBSECTION',
}
export enum StateAction {
  SET_NODE_SELECTED = 'STATE_SET_NODE_SELECTED',
  SET_FILE_SELECTED = 'STATE_SET_FILE_SELECTED',
}
export enum ContentAction {
  ADD_SECTIONS = 'CONTENT_ADD_SECTIONS',
}
export interface IdCommand<TAction> extends BaseCommand<TAction> {
  id: number;
}
export interface ValueCommand<TAction> extends BaseCommand<TAction> {
  value: string;
}
export interface ContentsCommand<TAction> extends BaseCommand<TAction> {
  contents: ContentSection[];
}
export interface ContentCommand<TAction> extends BaseCommand<TAction> {
  content: ContentSection;
}
export interface NodeCommand<TAction> extends BaseCommand<TAction> {
  node: FileTreeNode;
}
export interface FlagCommand<TAction> extends BaseCommand<TAction> {
  flag: boolean;
}
// type guards
export function isIdCommand(
  cmd: Command<BaseAction>
): cmd is IdCommand<BaseAction> {
  return !!cmd.hasOwnProperty('id');
}
export function isValueCommand(
  cmd: Command<BaseAction>
): cmd is ValueCommand<BaseAction> {
  return !!cmd.hasOwnProperty('value');
}
export function isContentsCommand(
  cmd: Command<BaseAction>
): cmd is ContentsCommand<BaseAction> {
  return !!cmd.hasOwnProperty('contents');
}
export function isContentCommand(
  cmd: Command<BaseAction>
): cmd is ContentCommand<BaseAction> {
  return !!cmd.hasOwnProperty('content');
}
export function isNodeCommand(
  cmd: Command<BaseAction>
): cmd is NodeCommand<BaseAction> {
  return !!cmd.hasOwnProperty('node');
}
export function isFlagCommand(
  cmd: Command<BaseAction>
): cmd is FlagCommand<BaseAction> {
  return !!cmd.hasOwnProperty('flag');
}
export type Command<TAction> =
  | BaseCommand<TAction>
  | IdCommand<TAction>
  | ValueCommand<TAction>
  | ContentsCommand<TAction>
  | ContentCommand<TAction>
  | NodeCommand<TAction>
  | FlagCommand<TAction>;
