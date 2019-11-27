# Camunda Modeler Fraunhofer Plugin

[![Compatible with Camunda Modeler version 3.3](https://img.shields.io/badge/Camunda%20Modeler-3.3+-blue.svg)](https://github.com/camunda/camunda-modeler)
[![pipeline status](https://gitlab-ext.iosb.fraunhofer.de/betnik/camunda-modeler-plugin/badges/master/pipeline.svg)](https://gitlab-ext.iosb.fraunhofer.de/betnik/camunda-modeler-plugin/commits/master)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)


This research plugin for the [Camunda Modeler](https://github.com/camunda/camunda-modeler) aims to aid the development of Apache Jena and SWRL pipelines.


## Development Setup

Use [npm](https://www.npmjs.com/), the [Node.js](https://nodejs.org/en/) package manager to download and install required dependencies:

```sh
npm install
```

To make the Camunda Modeler aware of your plug-in you must link the plug-in to the [Camunda Modeler plug-in directory](https://github.com/camunda/camunda-modeler/tree/develop/docs/plugins#plugging-into-the-camunda-modeler) via a symbolic link.
Available utilities to do that are [`mklink /d`](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/mklink) on Windows and [`ln -s`](https://linux.die.net/man/1/ln) on MacOS / Linux.

Re-start the app in order to recognize the newly linked plug-in.


## Building the Plug-in

You may spawn the development setup to watch source files and re-build the client plug-in on changes:

```sh
npm run dev
```

Given you've setup and linked your plug-in [as explained above](#development-setup), you should be able to reload the modeler to pick up plug-in changes. To do so, open the app's built in development toos via `F12`. Then, within the development tools press the reload shortcuts `CTRL + R` or `CMD + R` to reload the app.


To prepare the plug-in for release, executing all necessary steps, run:

```sh
npm run all
```


## Before you Publish

* [ ] Clearly state which Camunda Modeler version your plug-in is compatible with
* [ ] Clean up node dependencies which should not be bundled with webpack by declaring them as dev dependencies. 


## Additional Resources

### General Camunda Modeler Resources 

* [List of existing plug-ins](https://github.com/camunda/camunda-modeler-plugins)
* [Plug-ins documentation](https://github.com/camunda/camunda-modeler/tree/master/docs/plugins)

### BPMN Lint Resources 

* [BPMN Lint](https://github.com/bpmn-io/bpmnlint)
* [Camunda Modeler Custom Linter](https://github.com/camunda/camunda-modeler-linter-plugin)
* [Camunda Modeler Custom Linter Plugin Rules](https://github.com/camunda/camunda-modeler-custom-linter-rules-plugin)
* [List of available bpmn lint rules](https://github.com/bpmn-io/bpmnlint/tree/master/docs/rules)


## Licence

MIT
