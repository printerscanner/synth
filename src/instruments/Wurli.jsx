import * as Tone from 'tone'

const wurli = new Tone.Sampler({
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
  baseUrl: "../public/audio/wurli/",
  onload: () => {
  }
}).toDestination();

export default wurli