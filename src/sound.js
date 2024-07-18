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

  // Tone.js setup for random arpeggiated soundtrack
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  const scale = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
  let notes = [];

  // Generate a random sequence of 16 notes from the scale
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
