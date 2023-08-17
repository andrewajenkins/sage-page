import { FileTreeFile, FileTreeNode } from './file-tree.model';
import { ContentSection } from './section.model';

interface BaseCommand<TAction> {
  action: TAction;
}
export type BaseAction = EditorAction | NodeAction | StateAction | ContentAction;
export enum EditorAction {
  SAVE = 'EDITOR_SAVE',
  UNDO = 'EDITOR_UNDO',
  REDO = 'EDITOR_REDO',
  SELECT_ALL = 'EDITOR_SELECT_ALL',
  DELETE_SELECTED = 'EDITOR_DELETE_SELECTED',
  TOGGLE_HIGHLIGHT = 'EDITOR_TOGGLE_HIGHLIGHT',
  NONE = 'EDITOR_NONE',
  CREATE_SUBSECTION = 'NODE_CREATE_SUBSECTION',
}
export enum NodeAction {
  CREATE_FOLDER = 'NODE_CREATE_FOLDER',
  CREATE_FILE = 'NODE_CREATE_FILE',
  CREATE_SECTION = 'NODE_CREATE_SECTION',
  EDIT_NODE_NAME = 'NODE_EDIT_NODE_NAME',
  DELETE_CURRENT_NODE = 'NODE_DELETE_CURRENT_NODE',
  SAVE_FILE = 'NODE_SAVE_FILE',
  LOAD_FILE = 'NODE_LOAD_FILE',
  ADD_CONTENT = 'NODE_ADD_CONTENT',
  GENERATE_FILE_SECTIONS = 'NODE_GENERATE_FILE_SECTIONS',
  LOAD_SECTION = 'NODE_LOAD_SECTION',
  DELETE_NODE = 'NODE_DELETE_NODE',
}
export enum StateAction {
  SET_NODE_SELECTED = 'STATE_SET_NODE_SELECTED',
  SET_FILE_SELECTED = 'STATE_SET_FILE_SELECTED',
  SET_EDITOR_LEFT = 'STATE_SET_EDITOR_LEFT',
  SET_AUTO_ADJUST_HEADINGS = 'STATE_SET_AUTO_ADJUST_HEADINGS',
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
  section: ContentSection;
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
export interface FileCommand<TAction> extends BaseCommand<TAction> {
  file: FileTreeFile;
}
export interface SectionsCommand<TAction> extends BaseCommand<TAction> {
  sections: ContentSection[];
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
