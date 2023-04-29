# unit

Next Generation Visual Programming System

![unit merge sort example](/public/gif/0.gif)

## unit

unit is a General Purpose Visual Programming Language and Environment built with a primary focus on Developer Experience.

It is heavily inspired by Live, Data Flow, Reactive, Functional and Object Oriented Programming paradigms. Formally, units are Multi Input Multi Output (MIMO) Finite State Machines (FSM). A program in unit is represented as a Graph.

The unit Programming Language was developed in close junction to the unit Programming Environment, which is a Web application built for easy composition of new units. The environment is designed to feel visual and kinesthetic, giving the perception of Direct Manipulation of Live Virtual Objects. The unit Programming experience is minimalistic, ergonomic, mobile, and can be performed through a variety of input devices, and editing can be partially expressed through Drawing, Gesture and Voice.

unit is similar in concept to the Unix shell; for a seasoned programmer, unit should feel like the 2D evolution of the Command Line Interface (CLI) where units' (commands) inputs and outputs (stdin/stdout/stderr) can be piped together into a graph (script). In fact, unit can be thought of as a re-exploration of the [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) in the context of modern Software Engineering and Web Development.

The unit system is set to grow into a simple and approachable Web Operating System, which is sandboxed by default, enabling a new era of Software Sharing and Collaboration.

The broader Design Philosophy behind unit is discussed in [Concept](src/docs/concept/README.md).

To jump right into the official unit Programming Environment (Beta), visit [unit.land](https://unit.land). 

To experiment with a cloud extended version of unit, check out [ioun.it](https://ioun.it).

## Development

Install [npm](https://nodejs.org/en/download/) and [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if you haven't already.

Clone this repository:

```
git clone git@github.com:samuelmtimbo/unit.git
```

Get into the unit folder:

```
cd unit
```

Install:

```
npm install
```

Setup:

```
npm run setup
```

Start a local unit server:

```
npm start
```

For development mode:

```
npm run watch
```

## Library

unit can be used as a library in another JavaScript project, both on Web and Node.js.

```
npm install --save @_unit/unit
```

To install unit globally:

```
npm install --global @_unit/unit
```

Then to start a local server:

```
unit
```

## Test

```
npm test
```

## Links

List of useful links:

### [unit.land](https://unit.land)

```
https://*.unit.land
```

Fully local version of the unit Environment. Every unit you build will be saved automatically. Going to any \*.unit.land subdomain represents a completely isolated instance of the unit system.

### [unit.town](https://unit.town)

```
https://unit.town?title=
```

Marketplace for searching and sharing units. It is the first place to go look for an open source unit built by the community. 

### [unit.moe](https://unit.moe)

```
https://unit.moe#url
```

Appending #url to https://unit.moe will attempt to encapsulate the unit served at that URL in a graph editor. This is helpful for debugging an open unit website, for instance:

https://unit.moe#https://unit.land will show the code for https://unit.land.

https://unit.moe#https://ioun.it will show the code for https://ioun.it.

### [ioun.it](https://ioun.it)

UNIT IO is a platform specialized in unit software: tools, infrastructure and services for building and scaling unit systems on the cloud.

### [iframe.land](https://iframe.land)

Collection of utility apps built on top of open Web technology, mostly implemented in TypeScript. This is a nice way to extend the unit experience with pre-existing components such as maps, code editors, rich text, games, video players, social media, private spaces, and more. Each iframe.land subdomain represents one app and can be controlled through Asynchronous Messaging.

The code for iframe.land is Open Source and open for pull requests. Check out https://github.com/samuelmtimbo/iframe for documentation.

## Documentation

The unit Programming Environment was designed to be learnable by Experimentation and Exploration; visual and written documentation can be found inside the platform. For a step-by-step introduction to unit Programming, visit [Getting Started](src/docs/start/README.md).

This codebase is a TypeScript implementation of the unit Programming Language Spec with an accompanying Web based Programming Environment. I tried to make it as clean and organized as I could while still maintaining a space for experimentation. Some folders contain a `README.md` file with information about that piece of the architecture.

## Contributing

First of all, please feel free to clone or fork unit source code.

This is the best place to learn about unit design and implementation, and the official channel for Open Source collaboration.

This repository is open for pull requests from contributors. Please hit me up at [@io_sammt](https://twitter.com/io_sammt) if you want to help with unit development.

If you have a feature idea or hit a malfunction, this is a workflow I like to follow:

1. Iterate over a solution on top the latest main, testing it locally until it works and the code is clean;
2. Open a pull request explaining the problem and solution;
3. Iterate over it to make sure the change is positive and aligned with unit's design and vision.

The unit project has nearly infinite space for creative freedom, invention, and intimacy, which is what motivated me and made the it possible.

Ultimately, the goal is for everyone to have an easy to use, powerful and flexible visual system where one can build anything with absolute freedom, without ever having leave it.

## Community

If you have a question or a suggestion related to Open Source unit, or if you just want to talk about the Future of Programming, or if you want to join unit team, feel free to DM me at [@io_sammt](https://twitter.com/io_sammt).

For weekly updates about unit Development, including thoughts about Vision and Roadmap, follow us on Twitter [@io_unit](https://twitter.com/io_unit).

We hope you enjoy unit and invite you to be part of our community!

## License

MIT License

Copyright 2021 UNIT IO, Inc
