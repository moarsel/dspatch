export function BasicSynthesisTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        This patch adds an envelope to shape the oscillator's amplitude over time,
        creating a more musical sound.
      </p>

      <Section title="The Envelope">
        <p>
          An envelope is a control signal that changes over time when triggered.
          The ADSR envelope has four stages:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li><strong>Attack</strong> — how quickly the sound reaches full volume</li>
          <li><strong>Decay</strong> — how quickly it falls to the sustain level</li>
          <li><strong>Sustain</strong> — the level held while the note is on</li>
          <li><strong>Release</strong> — how quickly it fades after the note ends</li>
        </ul>
      </Section>

      <Section title="Amplitude Modulation">
        <p>
          When you multiply an oscillator's output by an envelope, you're
          modulating its amplitude. The envelope acts as a "volume knob" that
          moves automatically over time, giving the sound shape and dynamics.
        </p>
      </Section>

      <Section title="Why Envelopes Matter">
        <p>
          A constant tone sounds artificial and lifeless. Real sounds have
          attack (a piano hammer striking) and decay (the string resonating
          then fading). Envelopes let you sculpt these characteristics.
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
