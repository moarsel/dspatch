export function WelcomeTab() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        dspatch is a visual audio synthesis environment. Sound is created by
        connecting nodes that generate and transform signals.
      </p>

      <Section title="What is a Signal?">
        <p>
          A signal is a stream of numbers that changes over time. When these
          numbers are sent to your speakers fast enough (44,100 times per second),
          you hear sound. Higher numbers push the speaker out, lower numbers
          pull it in.
        </p>
      </Section>

      <Section title="What is a Patch?">
        <p>
          A patch is a network of connected nodes. Each node either generates
          a signal (like an oscillator) or transforms one (like a filter).
          Signals flow from left to right: a node outputs a signal from an outlet on its right side, which can then be connected to the inlet on another node's left side. The oscillator's output
          connects to the Output node's input.
        </p>
      </Section>

      <Section title="The Output Node">
        <p>
          Every patch needs an Output node. This is where your signal leaves
          the computer and becomes audible sound. Without it connected,
          you won't hear anything.
        </p>
      </Section>

      <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Click <strong>Start</strong> to load a simple patch and begin exploring
        </p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">{title}</h4>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}
