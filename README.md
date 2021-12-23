# unit

Next Generation Visual Programming Platform

![unit merge sort example](/public/gif/0.gif)

## unit

unit is a General Purpose Visual Programming Language and Environment built with a primary focus on Developer Experience. 

It is heavily inspired by Data Flow, Reactive, Functional and Object Oriented Programming paradigms. Formally, units are Multi Input Multi Output (MIMO) Finite State Machines (FSE). A program in unit is represented as a Graph.

The unit Programming Language was developed in close junction to the unit Programming Environment, which is a Web application built for easy composition of new units. The environment is designed to feel visual and kinesthetic, giving the perception of Direct Manipulation of Live Virtual Objects. The unit Programming experience is minimalistic and ergonomic; Programming can be partially performed by Gesture and by Voice.

unit is similar in concept to the Unix shell; for a seasoned programmer, unit should feel like the 2D evolution of the Command Line Interface (CLI) where units' (commands) inputs and outputs (stdin/stdout/stderr) can be piped together into a graph (script). In fact, unit can be thought of as a re-exploration of the [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) in the context of modern Software Engineering. 

The unit system is set to grow into a modern and approachable Web Operating System, which is sandboxed by default, enabling a new era of Software Sharing and Collaboration.

The broader Design Philosophy behind unit is discussed in [Concept](src/docs/concept/README.md).

To jump right into the official unit Programming Environment (Beta), visit [ioun.it](https://ioun.it).

The following is a manual on how to run a local version of the unit Programming Environment.

## Installation

Install [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) and [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if you haven't aready.

Clone this repository:

```
git clone git@github.com:samuelmtimbo/unit.git
```

Get into the unit folder:

```
cd unit
```

Install dependencies and build:

```
yarn
```

Build:

```
yarn setup
```

Start a local unit server:

```
yarn start
```

For development mode:

```
yarn watch
```

## Documentation

As an application, the unit Programming Environment was designed to be learnable by Experimentation and Exploration; visual and written documentation can be found inside the platform. For a step-by-step introduction to unit Programming, visit [Getting Started](src/docs/start/README.md).

This codebase is a TypeScript implementation of the unit Programming Language Spec with an accompanying Web based Programming Environment. I tried to make it as clean and organized as I could while still maintaining a space for experimentation. Some folders contain a `README.md` file with information about that piece of the architecture.

## Contributing

unit has been developed by a single Software Engineer, [Samuel Timbó](https://github.com/samuelmtimbo), working since 2017, first as a personal project and then later as a full-time job.

I would like to maintain the same level of creative freedom, invention, and intimacy that motivated me and made the project possible; that said, if you would like to directly participate in the development of Open Source unit, hit me up at [@io_sammt](https://twitter.com/io_sammt).

## Community

If you have a question or a suggestion related to Open Source unit, or if you just want to talk about the Future of Programming, feel free to DM me at [@io_sammt](https://twitter.com/io_sammt).

For weekly updates about unit Development, including thoughts about Vision and Roadmap, follow us on Twitter [@io_unit](https://twitter.com/io_unit).

We hope you enjoy unit and invite you to be part of our community!

## License

MIT License

Copyright 2021 UNIT IO, Inc
