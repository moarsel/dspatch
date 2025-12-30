export function SequencerTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        This patch uses a metro and sequencer to create an automatic pattern
        of notes, demonstrating to play a sequence of notes that starts 
        to sound like a real musical instrument.
      </p>

      <Section title="The Metro">
        <p>
          A metro (metronome) outputs a 1 at regular intervals. The
          interval is set in BPM: Beats per Minute. The default is 120, which is the same as 2 hZ (2 cycles per second).
          This creates the "clock" that drives rhythmic patterns.
        </p>
      </Section>

      <Section title="The Sequencer">
        <p>
          A sequencer outputs a given value in order every time it is triggered.
          When it receives a 1 from the metro, it advances to the next step in the sequence automatically.
        </p>
      </Section>

      <Section title="Note to Frequency">
        <p>
          It's easier to think about musical notes (A, A#, B, etc) than
          it is to memorize their raw frequencies. 
          The NoteToFreq node lets us select a note and output the right frequency for it: middle C
          is 261.6 Hz, A4 is440 Hz, etc. 
        </p>
      </Section>
      <Section title="MIDI Input">
        <p>
          We also want to be able to use a MIDI keyboard note (numbered 1-127) to output a frequency. 
          When this node receives a MIDI keyboard note from its left inlet, it outputs the correct frequency for the oscillator.
        </p>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">{title}</h4>
      <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}
