import { useState, useEffect } from 'react';
import wurli from './instruments/Wurli.jsx';

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const scaleTypes = {
  major: 'Major',
  minor: 'Minor 7',
  // Add more scale types here
};

function rotateArrayToPosition(arr, selectedItem) {
  const index = arr.indexOf(selectedItem);
  if (index === -1 || index === 0) {
    return arr;
  }
  const firstPart = arr.slice(0, index);
  const secondPart = arr.slice(index);
  return secondPart.concat(firstPart);
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
  if (addSeventh) intervals.push(6); // Add seventh
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
  const [audioContext, setAudioContext] = useState(null); // AudioContext state

  // Define playWurli function before useEffect
  const playWurli = (note, event) => {
    if (event) {
      event.target.classList.add('clicked');
    }

    // Resume AudioContext on user interaction (button click)
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log("AudioContext resumed after user interaction.");
      });
    }

    const chord = createChord(note, scaleType, addSeventh, addNinth, scale);
    wurli.triggerAttackRelease(chord, 1);
    if (playBassEveryNote) {
      playBaseEveryNote(note);
    }
  };

  useEffect(() => {
    // Create an AudioContext on initial render
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);

    setScale(createScale(selectedKey, scaleType));
  }, [selectedKey, scaleType]);

  useEffect(() => {
    const keyMappings = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];

    const handleKeyDown = (event) => {
      const keyIndex = keyMappings.indexOf(event.key);
      if (keyIndex !== -1 && scale[keyIndex]) {
        playWurli(scale[keyIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scale]);

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

  const playBaseEveryNote = (baseNote) => {
    wurli.triggerAttackRelease(baseNote + "1", "4n");
  };

  return (
    <div className="App">
      <img className="logo" src="public/synth.svg" alt="" />
      <header>
        {Object.keys(scaleTypes).map((type) => (
          <button
            key={type}
            className={`scale-button ${scaleType === type ? 'active' : ''}`}
            onClick={() => handleChangeScale(type)}
          >
            {scaleTypes[type]}
          </button>
        ))}
        <div style={{ width: "20%" }}>
          <select
            value={selectedKey}
            onChange={(e) => handleChangeKey(e.target.value)}
            className="key-dropdown"
            placeholder="Key"
          >
            {notes.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>

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

        <button
          className={`checkbox-button ${playBassEveryNote ? 'active' : ''}`}
          onClick={handleChangePlayBassEveryNote}
        >
          + Bass
        </button>
      </header>

      <div className="synth">
        {scale.map((note, index) => (
          <button
            key={index}
            className="piano-key"
            data-key={`Key${note}`}
            onClick={(event) => playWurli(note, event)}
          ></button>
        ))}
        
      </div>
      <footer>
        Under construction. By <a href="https://printerscanner.net">PS Studio</a>. Fork it on <a href="https://github.com/printerscanner/synth">Github</a>.
      </footer>
    </div>
  );
}

export default App;
