import { useState, useEffect } from 'react';
import wurli from './instruments/Wurli.jsx';
import base from './instruments/Base.jsx';

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const scaleTypes = {
  major: 'Major',
  minor: 'Minor 7',
  // Add more scale types here
};

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
  for (const interval of scaleIntervals[scaleType]) {
    scale.push(rotatedArray[interval]);
  }
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
  return generatedChord;
}

function App() {
  const [scaleType, setScaleType] = useState('major');
  const [selectedKey, setSelectedKey] = useState('C');
  const [addSeventh, setAddSeventh] = useState(false);
  const [addNinth, setAddNinth] = useState(false);
  const [playBassEveryNote, setPlayBassEveryNote] = useState(false);
  const [scale, setScale] = useState(createScale(selectedKey, scaleType));


  useEffect(() => {
    setScale(createScale(selectedKey, scaleType));
  }, [selectedKey, scaleType]);

  const handleChangeScale = (type) => {
    setScaleType(type);
  };

  const handleChangeKey = (key) => {
    setSelectedKey(key);
  };

  const handleChangeSeventh = () => {
    setAddSeventh(!addSeventh);
  };

  const handleChangeNinth = () => {
    setAddNinth(!addNinth);
  };

  const handleChangePlayBassEveryNote = () => {
    setPlayBassEveryNote(!playBassEveryNote);
  };

  const playBase = (scale, position) => {
    const baseNote = scale[position];
    base.triggerAttackRelease(baseNote + "1", "1n");
  };

  const playBaseEveryNote = (baseNote) => {
    wurli.triggerAttackRelease(baseNote + "1", "4n");
  };

  const playWurli = (note, event) => {
    if (event) {
      event.target.classList.add('clicked');
    }

    const chord = createChord(note, scaleType, addSeventh, addNinth, scale);
    wurli.triggerAttackRelease(chord, 1);
    if (playBassEveryNote) {
      playBaseEveryNote(note);
    }
  };

  return (
    <div className="App">
      <div>
        {Object.keys(scaleTypes).map((type) => (
          <button
            key={type}
            className={`scale-button ${scaleType === type ? 'active' : ''}`}
            onClick={() => handleChangeScale(type)}
          >
            {scaleTypes[type]}
          </button>
        ))}
      </div>
      <div>
        {notes.map((note) => (
          <button
            key={note}
            className={`key-button ${selectedKey === note ? 'active' : ''}`}
            onClick={() => handleChangeKey(note)}
          >
            {note}
          </button>
        ))}
      </div>
      <div>
        <button
          className={`checkbox-button ${addSeventh ? 'active' : ''}`}
          onClick={handleChangeSeventh}
        >
          + Seventh
        </button>
        <button
          className={`checkbox-button ${addNinth ? 'active' : ''}`}
          onClick={handleChangeNinth}
        >
          + Ninth
        </button>
      </div>
      <div>
        <button
          className={`checkbox-button ${playBassEveryNote ? 'active' : ''}`}
          onClick={handleChangePlayBassEveryNote}
        >
          + Bass with Every Note
        </button>
      </div>
      <div className="bass-buttons">
        <button onClick={() => playBase(scale, 2)}>Base 1</button>
        <button onClick={() => playBase(scale, 6)}>Base 2</button>
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
    </div>
  );
}

export default App;
