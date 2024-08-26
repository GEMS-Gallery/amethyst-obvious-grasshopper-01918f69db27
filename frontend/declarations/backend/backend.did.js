export const idlFactory = ({ IDL }) => {
  const Note = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'createdAt' : IDL.Int,
    'updatedAt' : IDL.Int,
  });
  return IDL.Service({
    'addNote' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    'deleteNote' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getNotes' : IDL.Func([], [IDL.Vec(Note)], ['query']),
    'updateNote' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
