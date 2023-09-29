// import './App.css';
import * as Tone from 'tone'

let cordBase = "C";


function playSynth(note, selectValue,event) {
  if (event) {
    event.target.classList.add('clicked')
  }
  const sampler = new Tone.Sampler({
    urls: {
      A1: "A1.wav",
      A2: "A2.wav",
      A3: "A3.wav",
      "Bb1": "As1.wav",
      "Bb2": "As2.wav",
      "Bb3": "As3.wav",
      B1: "B1.wav",
      B2: "B2.wav",
      B3: "B3.wav",
      C1: "C1.wav",
      C2: "C2.wav",
      C3: "C3.wav",
      C4: "C4.wav",
      "C#1": "Cs1.wav",
      "C#2": "Cs2.wav",
      "C#3": "Cs3.wav",
      "C#4": "Cs4.wav",
      D1: "D1.wav",
      D2: "D2.wav",
      D3: "D3.wav",
      D4: "D4.wav",
      "Eb1": "Ds1.wav",
      "Eb2": "Ds2.wav",
      "Eb3": "Ds3.wav",
      "Eb4": "Ds4.wav",
      E1: "E1.wav",
      E2: "E2.wav",
      E3: "E3.wav",
      E4: "E4.wav",
      F1: "F1.wav",
      F2: "F2.wav",
      F3: "F3.wav",
      F4: "F4.wav",
      "F#1": "Fs1.wav",
      "F#2": "Fs2.wav",
      "F#3": "Fs3.wav",
      G1: "G1.wav",
      G2: "G2.wav",
      G3: "G3.wav",
      "Ab1": "Gs1.wav",
      "Ab2": "Gs2.wav",
      "Ab3": "Gs3.wav",
    },
    baseUrl: "https://printerscanner.github.io/audio/wurli/",
    onload: () => {
      if (selectValue === "simple") {
        sampler.triggerAttackRelease(note, 5);
      } else {
      sampler.triggerAttackRelease(createCord(note), 1);
      }
    }
  }).toDestination();
  return cordBase = note;
}

function playSimpleSynth() {
  const sampler = new Tone.Sampler({
    urls: {
      A1: "A1.wav",
      "Bb1": "As1.wav",
      B1: "B1.wav",
      C1: "C1.wav",
      "C#1": "Cs1.wav",
      D1: "D1.wav",
      "Eb1": "Ds1.wav",
      E1: "E1.wav",
      F1: "F1.wav",
      "F#1": "Fs1.wav",
      G1: "G1.wav",
      "Ab1": "Gs1.wav",
    },
    baseUrl: "https://printerscanner.github.io/audio/heavy_base/",
    onload: () => {
      //play a note every sixteenth-note
      // new Tone.Loop(time => {
      //   sampler.triggerAttackRelease(cordBase + "1", "8n", time);
      // }, "4n").start(0);
      // Tone.Transport.toggle()
      sampler.triggerAttackRelease(cordBase + "1", "8n");
    }
  }).toDestination();
}

function createCord(cord) {
  let generatedCord = [];
  const scale = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
  let minorThird, majorFifth, ninth;
  for (let index = 0; index < scale.length; index++) {
    if (scale[index] === cord) {
      if (!scale[index + 3]) {
        minorThird = scale[index - 9]
      } else {
        minorThird = scale[index + 3]
      }
      if (!scale[index + 7]) {
        majorFifth = scale[index - 5]
      } else {
        majorFifth = scale[index + 7]
      }
      if (!scale[index + 2]) {
        ninth = scale[index - 10]
      } else {
        ninth = scale[index + 2]
      }
      generatedCord.push(scale[index] + '3');
      generatedCord.push(minorThird + '3');
      generatedCord.push(majorFifth + '3');
      generatedCord.push(ninth + '3');
    }
  }
  return generatedCord;
}

function arpeggiator(cordBase) {
  let createdCord = createCord(cordBase);
  console.log(createdCord)

  const sampler = new Tone.Sampler({
    urls: {
      A1: "A1.wav",
      A2: "A2.wav",
      A3: "A3.wav",
      "Bb1": "As1.wav",
      "Bb2": "As2.wav",
      "Bb3": "As3.wav",
      B1: "B1.wav",
      B2: "B2.wav",
      B3: "B3.wav",
      C1: "C1.wav",
      C2: "C2.wav",
      C3: "C3.wav",
      C4: "C4.wav",
      "C#1": "Cs1.wav",
      "C#2": "Cs2.wav",
      "C#3": "Cs3.wav",
      "C#4": "Cs4.wav",
      D1: "D1.wav",
      D2: "D2.wav",
      D3: "D3.wav",
      D4: "D4.wav",
      "Eb1": "Ds1.wav",
      "Eb2": "Ds2.wav",
      "Eb3": "Ds3.wav",
      "Eb4": "Ds4.wav",
      E1: "E1.wav",
      E2: "E2.wav",
      E3: "E3.wav",
      E4: "E4.wav",
      F1: "F1.wav",
      F2: "F2.wav",
      F3: "F3.wav",
      F4: "F4.wav",
      "F#1": "Fs1.wav",
      "F#2": "Fs2.wav",
      "F#3": "Fs3.wav",
      G1: "G1.wav",
      G2: "G2.wav",
      G3: "G3.wav",
      "Ab1": "Gs1.wav",
      "Ab2": "Gs2.wav",
      "Ab3": "Gs3.wav",
    },
    baseUrl: "https://printerscanner.github.io/audio/wurli/",
    onload: () => {
      const seq = new Tone.Sequence((time, note) => {
        sampler.triggerAttackRelease(note, "8n", time);
        // subdivisions are given as subarrays
      }, createdCord).start(0);
      Tone.Transport.start();
    }
  }).toDestination();
}

document.addEventListener("keydown",  (e) => {
  const dataKeys = document.querySelectorAll('[data-key]');

  dataKeys.forEach(element => {
    if (element.dataset.key === e.code) {
      element.click();
      element.addEventListener("animationend", function() {
        element.classList.remove("clicked");
    });
    } 
  });  
})


function App() {
  return (
    <div className="App">
      <button onClick={() => {arpeggiator(cordBase)}}>Arpeggiator</button>
      <div className="synth">
        <button className="button--small" data-key="KeyB" onClick={playSimpleSynth}><span className="button--small-inner"></span></button>
        <button className="button--circle" data-key="KeyV" onClick={playSimpleSynth}></button>
      </div>

      <div className="synth">
        <button className="button--square" data-key="KeyA" onClick={(event) => {playSynth("C",'poly', event)}}><span className="button--square-inner"></span></button>
        <button className="button--square button--black" data-key="KeyS" onClick={(event) => {playSynth("C#", 'poly',event)}}><span className="button--square-inner"></span></button>
        <button className="button--square" data-key="KeyD" onClick={(event) => {playSynth("D", 'poly', event)}}><span className="button--square-inner"></span></button>
        <button className="button--square button--black" data-key="KeyF" onClick={(event) => {playSynth("Eb", 'poly', event)}}><span className="button--square-inner"></span></button>
        <button className="button--square" data-key="KeyG" onClick={(event) => {playSynth("E", 'poly', event)}}><span className="button--square-inner"></span></button>
        <button className="button--square" data-key="KeyH" onClick={(event) => {playSynth("F", 'poly', event)}}><span className="button--square-inner"></span></button>
        <button className="button--square button--black" data-key="KeyJ" onClick={(event) => {playSynth("F#", 'poly',event)}}><span className="button--square-inner"></span></button>
        <button className="button--square" data-key="KeyK" onClick={(event) => {playSynth("G", 'poly', event)}}><span className="button--square-inner"></span></button>
        <button className="button--square button--black" data-key="KeyL" onClick={(event) => {playSynth("Ab", 'poly', event)}}><span className="button--square-inner"></span></button>
        <button className="button--square" data-key="Semicolon" onClick={(event) => {playSynth("A", 'poly', event)}}><span className="button--square-inner"></span></button>
        <button className="button--square button--black" data-key="Quote" onClick={(event) => {playSynth("Bb", 'poly', event)}}><span className="button--square-inner"></span></button>
        <button className="button--square" data-key="Backslash" onClick={(event) => {playSynth("B", 'poly', event)}}><span className="button--square-inner"></span></button>

      </div>

    </div>
  );
}

export default App;
