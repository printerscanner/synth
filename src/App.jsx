import { useState, useEffect } from 'react';
import * as Tone from 'tone';
import './App.css';
import wurli from './instruments/Wurli.jsx';

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G","G#", "A", "A#", "B"];


function rotateArrayToPosition(arr, selectedItem) {
  const index = arr.indexOf(selectedItem);

  if (index === -1) {
    // Item not found in the array
    return arr;
  }

  if (index === 0) {
    // Item not found in the array
    return arr;
  }

  const firstPart = arr.slice(0, index);
  const secondPart = arr.slice(index);
  const rotatedArray = secondPart.concat(firstPart);
  return rotatedArray;
}

function createScale(selectedKey, scaleType) {
  const scaleIntervals = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 9, 10],
  };

  const scale = [];
  const rotatedArray = rotateArrayToPosition(notes, selectedKey);
  console.log(rotatedArray)
  for (const interval of scaleIntervals[scaleType]) {
    scale.push(rotatedArray[interval]);
  }
  console.log(scale)
  return scale;
}

function createChord(baseNote, scaleType, addSeventh, addNinth, scale) {
  const intervals = [0, 2, 4]; // Default intervals for major and minor chords
  if (addSeventh) intervals.push(6); // Add seventh (default to major seventh)
  if (addNinth) intervals.push(1); // Add ninth

  const generatedChord = [];

  for (let index = 0; index < scale.length; index++) {
    if (scale[index] === baseNote) {
      for (const interval of intervals) {
        const noteIndex = (index + interval) % scale.length;
        const note = scale[noteIndex];
        if (note) {
          generatedChord.push(note + (interval === 0 ? '3' : interval === 2 ? '3' : interval === 6 ? '3' : interval === 1 ? '4' : '2'));
        }
      }
      break;
    }
  }
  console.log(generatedChord)

  return generatedChord;
}

function App() {
  const [scaleType, setScaleType] = useState('major');
  const [selectedKey, setSelectedKey] = useState('C'); // Default key is 'C'
  const [addSeventh, setAddSeventh] = useState(false);
  const [addNinth, setAddNinth] = useState(false);
  const [playBassEveryNote, setPlayBassEveryNote] = useState(false); // State to control bass note playing
  const [scale, setScale] = useState(createScale(selectedKey, scaleType));

  useEffect(() => {
    setScale(createScale(selectedKey, scaleType));
  }, [selectedKey, scaleType]);

  const handleChangeScale = (event) => {
    setScaleType(event.target.value);
  };

  const handleChangeKey = (event) => {
    setSelectedKey(event.target.value);
  };

  const handleChangeSeventh = (event) => {
    setAddSeventh(event.target.checked);
  };

  const handleChangeNinth = (event) => {
    setAddNinth(event.target.checked);
  };

  const handleChangePlayBassEveryNote = (event) => {
    setPlayBassEveryNote(event.target.checked);
  };

  const playBase = () => {
    wurli.triggerAttackRelease(selectedKey + "1", "4n");
    if (playBassEveryNote) {
      playBassNote(selectedKey);
    }
  };

  const playWurli = (note, event) => {
    if (event) {
      event.target.classList.add('clicked');
    }
    wurli.triggerAttackRelease(createChord(note, scaleType, addSeventh, addNinth, scale), 1);
    if (playBassEveryNote) {
      playBassNote(note);
    }
  };

  const playBassNote = (bassNote) => {
    wurli.triggerAttackRelease(bassNote + "1", "4n");
    wurli.triggerAttackRelease(scale[(scale.indexOf(bassNote) + 2) % scale.length] + "0", "8n"); // Play bass note a whole step above
  };

  return (
    <div className="App">
      <div>
        <label htmlFor="scaleSelect">Select Scale: </label>
        <select id="scaleSelect" value={scaleType} onChange={handleChangeScale}>
          <option value="major">Major</option>
          <option value="minor">Minor 7</option>
          {/* Add more scale types here */}
        </select>
      </div>
      <div>
        <label htmlFor="keySelect">Select Key: </label>
        <select id="keySelect" value={selectedKey} onChange={handleChangeKey}>
          {notes.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>
          Add Seventh:
          <input type="checkbox" checked={addSeventh} onChange={handleChangeSeventh} />
        </label>
        <label>
          Add Ninth:
          <input type="checkbox" checked={addNinth} onChange={handleChangeNinth} />
        </label>
      </div>
      <div>
        <label>
          Play Bass with Every Note:
          <input type="checkbox" checked={playBassEveryNote} onChange={handleChangePlayBassEveryNote} />
        </label>
      </div>
      <div className="synth">
        {scale.map((note, index) => (
          <button
            key={index}
            className={`piano-key${note.includes('#') ? ' black-key' : ' white-key'}`}
            data-key={`Key${note}`}
            onClick={(event) => playWurli(note, event)}
          >
            {note}
          </button>
        ))}
      </div>
      <div className="bass-buttons">
        <button onClick={() => playBase()}>Play Bass</button>
        <button onClick={() => playBase(scale[(scale.indexOf(selectedKey) + 2) % scale.length])}>Play Bass (Whole Step Up)</button>
      </div>
    </div>
  );
}

export default App;
