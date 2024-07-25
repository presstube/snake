import * as Tone from "tone";

// Function to start the arpeggiated music
export function startMusic() {
  // Tone.js setup for arpeggiated soundtrack
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  const notes = ["C4", "E4", "G4", "B4"];
  let index = 0;

  Tone.Transport.scheduleRepeat((time) => {
    synth.triggerAttackRelease(notes[index % notes.length], "8n", time);
    index++;
  }, "8n");

  Tone.Transport.start();
}

// Function to stop the music
export function stopMusic() {
  Tone.Transport.stop();
  Tone.Transport.cancel(); // Clear any scheduled events
}

// Function to start randomly assembled arpeggiation
export function startRandomMusic(fps) {
  // Set the tempo to match the fps
  Tone.Transport.bpm.value = fps * 10;

  // Randomly select a base pitch/octave
  const octaves = ["3", "4", "5"];
  const baseOctave = octaves[Math.floor(Math.random() * octaves.length)];

  // Randomly select an instrument/sound
  const instruments = [
    new Tone.Synth().toDestination(),
    new Tone.AMSynth().toDestination(),
    new Tone.FMSynth().toDestination(),
    new Tone.DuoSynth().toDestination(),
    new Tone.MonoSynth().toDestination(),
  ];
  const synth = instruments[Math.floor(Math.random() * instruments.length)];

  // Generate a random sequence of 16 notes from the scale
  const scale = [
    `C${baseOctave}`,
    `D${baseOctave}`,
    `E${baseOctave}`,
    `F${baseOctave}`,
    `G${baseOctave}`,
    `A${baseOctave}`,
    `B${baseOctave}`,
  ];
  let notes = [];
  for (let i = 0; i < 16; i++) {
    notes.push(scale[Math.floor(Math.random() * scale.length)]);
  }

  let index = 0;

  Tone.Transport.scheduleRepeat((time) => {
    synth.triggerAttackRelease(notes[index % notes.length], "8n", time);
    index++;
  }, "8n");

  Tone.Transport.start();
}
