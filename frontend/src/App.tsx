import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Container, Typography, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GridViewIcon from '@mui/icons-material/GridView';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import NoteModal from './components/NoteModal';

type Note = {
  id: bigint;
  title: string;
  content: string;
  createdAt: bigint;
  updatedAt: bigint;
};

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await backend.getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddNote = () => {
    setCurrentNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (id: bigint) => {
    try {
      await backend.deleteNote(id);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleSaveNote = async (title: string, content: string) => {
    try {
      if (currentNote) {
        await backend.updateNote(currentNote.id, title, content);
      } else {
        await backend.addNote(title, content);
      }
      setIsModalOpen(false);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <button>
          <GridViewIcon />
        </button>
        <button>
          <StarIcon />
        </button>
        <button>
          <SearchIcon />
        </button>
        <button>
          <SettingsIcon />
        </button>
      </div>
      <div className="main-content">
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              My Notes
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNote}
              sx={{ mb: 2 }}
            >
              Add Note
            </Button>
            <Grid container spacing={2}>
              {notes.map((note) => (
                <Grid item xs={12} sm={6} md={4} key={Number(note.id)}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="h2">
                        {note.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {note.content}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => handleEditNote(note)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteNote(note.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </div>
      <NoteModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        note={currentNote}
      />
    </div>
  );
};

export default App;
