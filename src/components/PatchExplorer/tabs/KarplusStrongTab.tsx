import React from 'react'

export function KarplusStrongTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        This patch demonstrates the Karplus-Strong string synthesis algorithm. 
        It works by feeding a short burst of noise into a tuned delay line with high feedback.
      </p>

      <Section title="How it works">
        <p>
          The "string" sound is actually a delay effect! By setting the delay time to the exact length of a sound wave
          (1000ms / frequency), the repeating echo creates a pitched tone. The feedback loops the sound,
          creating the sustain.
        </p>
      </Section>

      <Section title="The Patch">
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li><strong>Noise + Envelope</strong> — Creates the initial "pluck" excitation.</li>
          <li><strong>Delay</strong> — The core of the string sound. High feedback creates the tone.</li>
          <li><strong>Math Node</strong> — Calculates the delay time in milliseconds (1000 / Frequency) to adjust the feedback tone for different notes.</li>
          <li><strong>Filter</strong> — Shapes the tone and removes harsh high frequencies.</li>
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