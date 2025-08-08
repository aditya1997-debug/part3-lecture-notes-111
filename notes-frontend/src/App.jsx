import { useState, useEffect } from 'react'
import Note from './components/Note'
import Footer from './components/Footer'
import noteService from './services/notes'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const addNote = (event) => {
    event.preventDefault()
    if (newNote.trim() === '') return // Prevent empty note submission

    const noteObject = {
      content: newNote.trim(),
      important: Math.random() < 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
      .catch(error => {
        console.error("Error adding note:", error)
        setErrorMessage("Failed to save the note")
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    if (!note) return

    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id === id ? returnedNote : n))
      })
      .catch(() => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => setErrorMessage(null), 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
      .catch(error => {
        console.error("Error fetching notes:", error)
        setErrorMessage("Failed to fetch notes")
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }, [])

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
          placeholder="Write a new note..."
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
