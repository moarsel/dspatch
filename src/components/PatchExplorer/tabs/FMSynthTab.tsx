import React from 'react'

export function FMSynthTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        Frequency Modulation (FM) synthesis creates complex timbres by modulating the frequency
        of one oscillator (the carrier) with another oscillator (the modulator). This technique
        is known for creating bell-like, metallic, and evolving sounds.
      </p>

      <Section title="How it works">
        <p>
          In this patch, we use two oscillators. One generates the sound you hear (Carrier), and the other
          rapidly changes (modulates) the pitch of the first one (Modulator). By changing the ratio between
          their frequencies and the amount of modulation (gain of the modulator), you can create a wide variety of tones.
        </p>
      </Section>

      <Section title="The Patch">
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li><strong>Carrier Oscillator</strong> — The main sound source (just a normal Oscillator).</li>
          <li><strong>Modulator Oscillator</strong> — Modulates the carrier's frequency using an LFO (Low Frequency Oscillator).</li>
          <li><strong>Math Node</strong> — Adds the modulation signal to the base frequency.</li>
          <li><strong>Number Node</strong> — Sets the base frequency.</li>
          <li><strong>Envelope</strong> — Controls the volume of the sound.</li>
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
