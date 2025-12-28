export function GettingStartedTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        This patch demonstrates the most fundamental concept in synthesis:
        an oscillator connected to an output.
      </p>

      <Section title="The Oscillator">
        <p>
          An oscillator generates a repeating waveform. The <strong>frequency</strong> controls
          how fast it repeats — higher frequencies sound higher pitched. 440 Hz means
          the wave completes 440 cycles every second (the note A4).
        </p>
        <p>
          The <strong>waveform</strong> determines the shape of the wave, which affects
          the tone color (timbre). A sine wave is pure and smooth. A sawtooth wave
          is bright and buzzy because it contains many harmonics.
        </p>
      </Section>

      <Section title="The Bang">
        <p>
          A Bang sends a single trigger pulse when clicked. In this patch, it
          triggers the envelope that shapes the sound. Without a trigger, the
          envelope stays silent.
        </p>
      </Section>

      <Section title="Signal Flow">
        <p>
          Signals flow downward through connections. The oscillator's output
          connects to the Output node's input. This simple chain — source to
          output — is the foundation of every patch you'll build.
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
