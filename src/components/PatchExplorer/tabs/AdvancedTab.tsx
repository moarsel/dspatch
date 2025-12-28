export function AdvancedTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        This patch demonstrates FM synthesis, where one oscillator modulates
        another's frequency to create complex, evolving timbres.
      </p>

      <Section title="Frequency Modulation">
        <p>
          In FM synthesis, a "modulator" oscillator's output is added to a
          "carrier" oscillator's frequency. When the modulator is fast (audio
          rate), it creates new harmonic content. When slow (sub-audio), it
          creates vibrato.
        </p>
      </Section>

      <Section title="Modulation Depth">
        <p>
          The amount of modulation determines how dramatic the effect is. Small
          amounts add subtle movement. Large amounts create metallic, bell-like,
          or chaotic timbres. The ratio between carrier and modulator frequencies
          determines whether the result sounds harmonic or inharmonic.
        </p>
      </Section>

      <Section title="Why FM Works">
        <p>
          When you rapidly change a wave's frequency, you're compressing and
          stretching it, which adds new frequency components (sidebands) to
          the sound. This is how FM creates tones far richer than the simple
          waves that generate them.
        </p>
      </Section>

      <Section title="Classic FM Sounds">
        <p>
          FM synthesis is famous for electric pianos, bells, and metallic
          percussion — sounds that are difficult to create with traditional
          subtractive synthesis. The DX7 synthesizer popularized this technique
          in the 1980s.
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
