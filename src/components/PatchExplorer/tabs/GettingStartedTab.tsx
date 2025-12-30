export function GettingStartedTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        This patch demonstrates the most fundamental concept in synthesis:
        an oscillator connected to an output.
      </p>

      <Section title="The Oscillator">
        <p>
          An oscillator makes a sound by cycling between the values 1 and -1 very quickly to push and pull your speaker back and forth. The <strong>frequency</strong> controls
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
          A Bang sends a signal with the value 1 when clicked, or a 0 when not being clicked. In this patch, this signal goes into the 'gain' inlet for the oscillator, which controls the height of the wave (a.k.a. it's "amplitude").
          When we click the button and send a 1 the oscillator is full volume, and when we release the button, the height of the wave is 0 and the oscillator is silent.
        </p>
      </Section>

      <Section title="Signal Flow">
        <p>
         The values being sent through each connection can be visualized by looking at the number displayed in the middle of each connecting line. 
         For a signal like an oscillator, the number changes between -1 and 1 so quickly that it is more helpful to see a zoomed in snapshot of current value. Click the edge button to see the scope view between the oscillator and the output.
         To visualize how a signal changes over several seconds, you can get a more zoomed out view with the wave view. Select the wave view for the connetion between the Bang and the Oscillator.
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
