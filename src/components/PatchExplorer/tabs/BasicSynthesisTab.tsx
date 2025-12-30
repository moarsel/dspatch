export function BasicSynthesisTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        This patch adds an envelope to shape the oscillator's amplitude over time,
        creating a more musical sound. Instead of just setting the volume of a note to 0 or 1, 
        we can have more control of the volume over time. For example, a violin might stay at 
        the same volume for several seconds, but a drum hit will be get loud quickly then fade out just as fast.
      </p>

      <Section title="The Envelope">
        <p>
          An envelope is a signal that changes over time when triggered.
          The ADSR envelope has four stages:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li><strong>Attack</strong> — how quickly the sound reaches full volume</li>
          <li><strong>Decay</strong> — how quickly it falls to the sustain level</li>
          <li><strong>Sustain</strong> — the level held while the note is on</li>
          <li><strong>Release</strong> — how quickly it fades after the note ends</li>
        </ul>
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
