export function SequencerTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        This patch uses a metro and sequencer to create an automatic pattern
        of notes, demonstrating how timing and control signals work.
      </p>

      <Section title="The Metro">
        <p>
          A metro (metronome) outputs a trigger at regular intervals. The
          interval is set in milliseconds — 500ms means two triggers per
          second. This creates the "clock" that drives rhythmic patterns.
        </p>
      </Section>

      <Section title="The Sequencer">
        <p>
          A sequencer stores a list of values and steps through them each
          time it receives a trigger. Connect a metro to advance it
          automatically. Each step outputs a different value — typically
          used for pitch or other parameters.
        </p>
      </Section>

      <Section title="Control vs Audio Signals">
        <p>
          Some signals carry audio (oscillators, filters). Others carry
          control information (sequencer values, triggers). Control signals
          change slowly and drive parameters. Audio signals change rapidly
          and become sound.
        </p>
      </Section>

      <Section title="Note to Frequency">
        <p>
          MIDI note numbers (0-127) are easier to think about musically than
          raw frequencies. The NoteToFreq node converts: note 60 is middle C
          (261.6 Hz), note 69 is A4 (440 Hz). Each +12 notes doubles the
          frequency (one octave).
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
