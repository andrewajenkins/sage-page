import { ContentNode } from './content-node.model';

interface BaseCommand<TAction> {
  action: TAction;
}
export type BaseAction = EditorAction | NodeAction | StateAction | ContentAction | ConvoAction;
export enum EditorAction {
  SAVE = 'EDITOR_SAVE',
  SELECT_ALL = 'EDITOR_SELECT_ALL',
  DELETE_SELECTED = 'EDITOR_DELETE_SELECTED',
  NONE = 'EDITOR_NONE',
  CREATE_SUBSECTION = 'EDITOR_CREATE_SUBSECTION',
  CREATE_SECTION = 'EDITOR_CREATE_SECTION',
  SAVE_SECTION = 'EDITOR_SAVE_SECTION',
  SAVE_CONTENT = 'EDITOR_SAVE_CONTENT',
  COPY_ALL = 'EDITOR_COPY_ALL',
  COPY_SELECTED = 'EDITOR_COPY_SELECTED',
  DESELECT_ALL = 'EDITOR_DESELECT_ALL',
  ADD_NEW_SECTION = 'EDITOR_ADD_NEW_SECTION',
  UPLOAD = 'EDITOR_UPLOAD',
}
export enum NodeAction {
  CREATE_FOLDER = 'NODE_CREATE_FOLDER',
  CREATE_FILE = 'NODE_CREATE_FILE',
  EDIT_NODE_NAME = 'NODE_EDIT_NODE_NAME',
  DELETE_CURRENT_NODE = 'NODE_DELETE_CURRENT_NODE',
  LOAD_NODE = 'NODE_LOAD_NODE',
  DELETE_NODE = 'NODE_DELETE_NODE',
  UPDATE_NODE = 'NODE_UPDATE_NODE',
}
export enum StateAction {
  SET_NODE_SELECTED = 'STATE_SET_NODE_SELECTED',
  SET_FILE_SELECTED = 'STATE_SET_FILE_SELECTED',
  SET_EDITOR_LEFT = 'STATE_SET_EDITOR_LEFT',
  SET_AUTO_ADJUST_HEADINGS = 'STATE_SET_AUTO_ADJUST_HEADINGS',
  COLLAPSE_FILE_TREE_ALL = 'STATE_COLLAPSE_FILE_TREE_ALL',
  EXPAND_FILE_TREE_ALL = 'STATE_EXPAND_FILE_TREE_ALL',
  NOTIFY = 'STATE_NOTIFY',
}
export enum ConvoAction {
  CREATE_FOLDER = 'CONVO_CREATE_FOLDER',
  CREATE_CONVO = 'CONVO_CREATE_FILE',
  EDIT_NODE_NAME = 'CONVO_EDIT_NODE_NAME',
  DELETE_CURRENT_NODE = 'CONVO_DELETE_CURRENT_NODE',
  LOAD_NODE = 'CONVO_LOAD_NODE',
  DELETE_NODE = 'CONVO_DELETE_NODE',
  UPDATE_NODE = 'CONVO_UPDATE_NODE',
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
export interface SectionCommand<TAction> extends BaseCommand<TAction> {
  section: ContentNode;
}
export interface ContentCommand<TAction> extends BaseCommand<TAction> {
  content: ContentNode;
}
export interface NodeCommand<TAction> extends BaseCommand<TAction> {
  node: ContentNode;
}
export interface FlagCommand<TAction> extends BaseCommand<TAction> {
  flag: boolean;
}
export interface FileCommand<TAction> extends BaseCommand<TAction> {
  file: ContentNode;
}
export interface SectionsCommand<TAction> extends BaseCommand<TAction> {
  sections: ContentNode[];
}
export type Command<TAction> =
  | BaseCommand<TAction>
  | IdCommand<TAction>
  | ValueCommand<TAction>
  | SectionCommand<TAction>
  | SectionsCommand<TAction>
  | ContentCommand<TAction>
  | NodeCommand<TAction>
  | FlagCommand<TAction>
  | FileCommand<TAction>;
// type guards
export function isIdCommand(cmd: Command<BaseAction>): cmd is IdCommand<BaseAction> {
  return !!cmd.hasOwnProperty('id');
}
export function isValueCommand(cmd: Command<BaseAction>): cmd is ValueCommand<BaseAction> {
  return !!cmd.hasOwnProperty('value');
}
export function isSectionCommand(cmd: Command<BaseAction>): cmd is SectionCommand<BaseAction> {
  return !!cmd.hasOwnProperty('section');
}
export function isSectionsCommand(cmd: Command<BaseAction>): cmd is SectionsCommand<BaseAction> {
  return !!cmd.hasOwnProperty('sections');
}
export function isContentCommand(cmd: Command<BaseAction>): cmd is ContentCommand<BaseAction> {
  return !!cmd.hasOwnProperty('content');
}
export function isNodeCommand(cmd: Command<BaseAction>): cmd is NodeCommand<BaseAction> {
  return !!cmd.hasOwnProperty('node');
}
export function isFlagCommand(cmd: Command<BaseAction>): cmd is FlagCommand<BaseAction> {
  return !!cmd.hasOwnProperty('flag');
}
export function isFileCommand(cmd: Command<BaseAction>): cmd is FileCommand<BaseAction> {
  return !!cmd.hasOwnProperty('file');
}
