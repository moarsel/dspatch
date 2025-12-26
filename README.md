# Dspatch

Visual programming for audio synthesis.


## UI

- more excellent ui, subtle intetgration of some bold skeumorphism in key areas that create joy and resonance. e.g. output should have a speaker grill, scope should looke like an oscilloscope. inspired by jhey: https://codepen.io/jh3y/pen/WbQNxXb https://codepen.io/jh3y/pens/popular
- edge displays active/inactive signal chain. subtle number animations. nice feeling toggles
    - active signal shows value number circle in middle
        - https://reactflow.dev/ui/components/data-edge
    - line itself is an animate scope?
    - animate along path: https://reactflow.dev/ui/components/animated-svg-edge
        - https://reactflow.dev/examples/edges/animating-edges
        https://github.com/xyflow/xyflow/blob/main/packages/system/src/utils/edges/bezier-edge.ts/ 
- visualize filled vs unfilled inlets. validate inlet additions
- drag to select edges
- copy / paste
- undo / redo
- collapsable side panel, move to right side. collapsible category menus. type to filter? see shadcn sidebar 
- help tooltips?

## Features
- load/save patches
- built in patch explorer (+ educational like PD had). large top title bar changes depending on selection, vertical tabs below on left.
    - welcome splash screen (keep required click functionality)
    - getting started
    - basic synthesis
    - sequencer / sampler
    - FM synth / AM synth
    - good preset instruments

- sub patches w custom uis
    - like you should be able to play around then set your ins/out and wrap your thing with a custom ui so that its totally composable.
    - sandbox/playground style editor? https://www.elementary.audio/docs/playground_api 
    - programatic ui builder from descriptor?
    - save as compressed url a la https://nyman.re/mapdraw/#l=60.172108%2C24.941458&z=16 and https://textarea.my/
    - i want to be able to make something like: https://teetow.com/elementary_grid/

- editable programatic text view of signal flow (like that other cool app i saw)

- vst export


## Patches
- looper
- pitch shift
- record clip
- sampler