import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Button,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  CloudDone as CloudDoneIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { pageBackground } from '../styles/common';

const TextEditor = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('Untitled Document');
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaved(false);
  };

  return (
    <Box sx={pageBackground}>
      <AppBar
        position="fixed"
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{ mr: 2 }}
            onClick={() => navigate('/')}
          >
            <ArrowBackIcon />
          </IconButton>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="standard"
            placeholder="Document Title"
            sx={{
              input: {
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 500,
                letterSpacing: 0.5,
                '&::placeholder': {
                  color: alpha('#fff', 0.7),
                },
              },
              width: '300px',
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          {saved ? (
            <Tooltip title="All changes saved">
              <CloudDoneIcon sx={{ mr: 2, color: '#10b981' }} />
            </Tooltip>
          ) : null}
          <Button color="inherit" startIcon={<ShareIcon />} sx={{ mr: 2 }}>
            Share
          </Button>
          <Button
            color="inherit"
            startIcon={<SaveIcon />}
            onClick={() => setSaved(true)}
            sx={{
              background: 'linear-gradient(45deg, #a78bfa 30%, #f472b6 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7c3aed 30%, #db2777 90%)',
              },
            }}
          >
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{
          mt: 12,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            width: '100%',
            maxWidth: 900,
            p: 0,
            background: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.2)',
            borderRadius: 3,
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <TextField
            fullWidth
            multiline
            inputRef={textFieldRef}
            variant="outlined"
            placeholder="Start typing or paste your text here..."
            value={content}
            onChange={handleContentChange}
            minRows={25}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                background: 'none',
                border: 'none',
                fontFamily:
                  '"Fira Mono", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace',
                fontSize: '1.1rem',
                color: '#f1f5f9',
                lineHeight: 1.7,
                padding: 0,
                '& textarea': {
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  color: 'inherit',
                  background: 'none',
                  padding: 2,
                  outline: 'none',
                  border: 'none',
                  resize: 'none',
                },
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default TextEditor;
