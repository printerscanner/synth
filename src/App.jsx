import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import './App.css';
import base from './instruments/Base.jsx';
import wurli from './instruments/Wurli.jsx';

function createScale(selectedKey, scaleType) {
  const scaleIntervals = {
    major: [2, 4, 5, 7, 9, 11],
    minor: [2, 3, 5, 7, 8, 10],
  };

  const diatonicNotes = ["C", "D", "E", "F", "G", "A", "B"];

  const scale = [];
  let currentIndex = diatonicNotes.indexOf(selectedKey);

  for (const interval of scaleIntervals[scaleType]) {
    scale.push(diatonicNotes[currentIndex % 7]);
    currentIndex += interval;
  }

  return scale;
}

function createChord(baseNote, scaleType, addSeventh, addNinth, scale) {
  const intervals = scaleType === "major" ? [0, 2, 4] : [0, 2, 3]; // Default intervals for major and minor chords
  if (addSeventh) intervals.push(5); // Add seventh (default to major seventh)
  if (addNinth) intervals.push(7); // Add ninth

  const generatedChord = [];

  for (let index = 0; index < scale.length; index++) {
    if (scale[index] === baseNote) {
      for (const interval of intervals) {
        const noteIndex = (index + interval) % scale.length;
        const note = scale[noteIndex];
        if (note) {
          generatedChord.push(note + (interval === 0 ? '1' : interval === 2 ? '3' : interval === 5 ? '7' : '9'));
        }
      }
      break;
    }
  }

  return generatedChord;av
}

function App() {
  const [scaleType, setScaleType] = useState('major');
  const [selectedKey, setSelectedKey] = useState('C'); // Default key is 'C'
  const [addSeventh, setAddSeventh] = useState(false);
  const [addNinth, setAddNinth] = useState(false);
  const [playBassEveryNote, setPlayBassEveryNote] = useState(false); // State to control bass note playing
  // const [arpeggioType, setArpeggioType] = useState('off'); // State to control arpeggio
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

  /* const handleChangeArpeggio = (event) => {
    setArpeggioType(event.target.value);
  }; */

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

  /* document.addEventListener("keydown", (e) => {
    const dataKeys = document.querySelectorAll('[data-key]');

    dataKeys.forEach(element => {
      if (element.dataset.key === e.code) {
        element.click();
        element.addEventListener("animationend", function () {
          element.classList.remove("clicked");
        a});
      }
    });
  }); */

  return (
    <div className="App">
      <div>
        <label htmlFor="scaleSelect">Select Scale: </label>
        <select id="scaleSelect" value={scaleType} onChange={handleChangeScale}>
          <option value="major">Major</option>
          <option value="minor">Minor</option>
          {/* Add more scale types here */}
        </select>
      </div>
      <div>
        <label htmlFor="keySelect">Select Key: </label>
        <select id="keySelect" value={selectedKey} onChange={handleChangeKey}>
          {scale.map((note) => (
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
            key={note}
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
