# Evolution

Currently, these are the most taped development frontlines:

## Language

The internal functioning of Unit is rulled by a collection of lower level classes that define reusable naturally occuring multi-input-multi-output state machines, which are the basis of the Unit system, such as [Unit](../../Class/Unit/index.ts), [Primitive](../../Class/Primitive/index.ts), [Functional](../../Class/Functional/index.ts) and [Graph](../../Class/Graph/index.ts). Every object in Unit extends [\$](../../Class/$/index.ts) base class.

## Primitives

Unit's primitives mostly grow in a few directions:

- Control (common, globally useful, flow control programming patterns)
- Web (new Web APIs and components)
- Node.js (lower level APIs unnavailable on the Web)
- System (allow the user to create and control sandboxed sub-systems)
- Extension (complementary APIs only available to Web extensions)

Each new API is to be wrapped into a carefully designed and well documented primitive state machine.

All currently available primitives live in the [system](/src/system) folder.

These are examples of primitive classes: [`add`](/src/system/f/arithmetic/Add/index.ts) (`+` operation), [`oscilator node`](/src/system/platform/api/media/audio/OscillatorNode/index.ts) (Web Audio API), and `peer transmitter` (simplified Web RTC).

## Editor

The Unit [Editor](../../system/platform/component/app/Editor/Component.ts) is where most of the live programming interactivity is implemented right now. It is the main place to improve the graph editing experience.

These are some common areas the editor can continuously improve:

- Gestures
- Modes
- Input Devices
- Shortcuts
- Multitouch
- Data Manipulation
- Performance
- Accessibility
- Type System
- Debugging
- Animation
- Customization
- Meta Programming
- External API
- UI/UX

## Composition

The default Unit system comes with a standard collection of generally useful logical unit graphs out of the box.

This is what a graph looks like in JSON, usually found at the "core" folder: [`if else`](/src/unit/src/system/core/control/IfElse/spec.json) and [`range`](/src/system/core/loop/Range/spec.json).

Expanding and reusing the core library can reduce the global size of units when sharing units around.

Right now the collection is composed of mostly lower level functional units that facilitate normal development.

## Decomposition

Some components, such as the editor itself, have been written in TypeScript during the process of boostraping Unit.

Continuously abstracting away functionality from textually defined components in the form of units has many advantages:

- Reduces the reliance on TypeScript (more of the codebase will become JSON)
- Makes it easier to port Unit to different languages / runtimes
- New units for the Standard Library (which are naturally reusable)
- Dogfeeds the system (making sure common graphs look aesthetical is a good language design compass)
- Enforces optimization (the framework ought to be as fast as possible for its own spec)
