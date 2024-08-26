import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";

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

  public func addNote(title: Text, content: Text) : async Text {
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
    Nat.toText(id)
  };

  public query func getNotes() : async [Note] {
    Iter.toArray(Iter.map(notes.entries(), func (entry: (Nat, Note)): Note { entry.1 }))
  };

  public func updateNote(id: Text, title: Text, content: Text) : async Bool {
    switch (textToNat(id)) {
      case (?natId) {
        switch (notes.get(natId)) {
          case (null) { false };
          case (?existingNote) {
            let updatedNote: Note = {
              id = natId;
              title = title;
              content = content;
              createdAt = existingNote.createdAt;
              updatedAt = Time.now();
            };
            notes.put(natId, updatedNote);
            true
          };
        };
      };
      case (null) { false };
    };
  };

  public func deleteNote(id: Text) : async Bool {
    switch (textToNat(id)) {
      case (?natId) {
        switch (notes.remove(natId)) {
          case (null) { false };
          case (?_) { true };
        };
      };
      case (null) { false };
    };
  };

  func textToNat(t : Text) : ?Nat {
    var n : Nat = 0;
    for (c in t.chars()) {
      let charNat = Nat32.toNat(Char.toNat32(c));
      if (charNat >= 48 and charNat <= 57) {
        n := n * 10 + (charNat - 48);
      } else {
        return null; // Invalid character
      };
    };
    ?n
  };
}
