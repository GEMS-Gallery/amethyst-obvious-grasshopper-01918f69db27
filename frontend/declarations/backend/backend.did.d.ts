import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Note {
  'id' : bigint,
  'title' : string,
  'content' : string,
  'createdAt' : bigint,
  'updatedAt' : bigint,
}
export interface _SERVICE {
  'addNote' : ActorMethod<[string, string], bigint>,
  'deleteNote' : ActorMethod<[bigint], boolean>,
  'getNotes' : ActorMethod<[], Array<Note>>,
  'updateNote' : ActorMethod<[bigint, string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
