import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";

actor {
  type Note = {
    id: Nat;
    title: Text;
    content: Text;
    createdAt: Int;
    updatedAt: Int;
  };

  stable var nextNoteId: Nat = 0;
  let notes = HashMap.HashMap<Nat, Note>(0, Nat.equal, Nat.hash);

  public func addNote(title: Text, content: Text) : async Nat {
    let id = nextNoteId;
    let timestamp = Time.now();
    let note: Note = {
      id = id;
      title = title;
      content = content;
      createdAt = timestamp;
      updatedAt = timestamp;
    };
    notes.put(id, note);
    nextNoteId += 1;
    id
  };

  public query func getNotes() : async [Note] {
    Iter.toArray(Iter.map(notes.entries(), func (entry: (Nat, Note)): Note { entry.1 }))
  };

  public func updateNote(id: Nat, title: Text, content: Text) : async Bool {
    switch (notes.get(id)) {
      case (null) { false };
      case (?existingNote) {
        let updatedNote: Note = {
          id = id;
          title = title;
          content = content;
          createdAt = existingNote.createdAt;
          updatedAt = Time.now();
        };
        notes.put(id, updatedNote);
        true
      };
    }
  };

  public func deleteNote(id: Nat) : async Bool {
    switch (notes.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };
}
