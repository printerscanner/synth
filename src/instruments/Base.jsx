import * as Tone from 'tone'


const base = new Tone.Sampler({
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
  baseUrl: "../public/audio/heavy_base/",
  onload: () => {}
}).toDestination();

export default base