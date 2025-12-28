export function PresetsTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        A collection of pre-built patches demonstrating different synthesis
        techniques. Each preset loads a complete working patch.
      </p>

      <div className="grid gap-3">
        <PresetCard
          name="Sine Drone"
          description="A simple sustained tone — the most basic possible patch"
        />
        <PresetCard
          name="Pluck"
          description="Envelope-shaped oscillator with fast attack and decay"
        />
        <PresetCard
          name="FM Bell"
          description="Two-operator FM creating metallic bell tones"
        />
        <PresetCard
          name="Arpeggio"
          description="Sequenced notes with envelope shaping"
        />
        <PresetCard
          name="Filtered Noise"
          description="White noise through a resonant filter"
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Presets coming soon
      </p>
    </div>
  )
}

interface PresetCardProps {
  name: string
  description: string
}

function PresetCard({ name, description }: PresetCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-4 opacity-50">
      <h4 className="font-medium">{name}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
