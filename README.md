# jarvis-api [WIP]

> JARVIS: Just a rather very intelligent system

This project is the API part of the JARVIS system. It's a collection of various plugins for managing your busy life. (Use the [jarvis-client](https://github.com/eheikes/jarvis-client) for a UI frontend.)

## Installation

You'll need [Node.js](https://nodejs.org/) to run the server. Once that is installed, run `npm install` in the project folder to install the node modules.

## Usage

```shell
DEBUG=jarvis-api:* npm start
```

## Configuration

You should have at least one plugin configured. Add a `local.yaml` inside the `config` folder with a section for each service you want to use, for example:

```yaml
plugins:

  ToRead:
    type: ericsBookmarks
    url: http://example.com/toreadapi.php

  Trello:
    type: trello
    key: 0eec1ed0c34e3e58d7f9d50016f952dc
    token: 47734764329a6c48e92449612244b81cbbb80a8259647d6b488d425b0d9e1799
    board: dc63a43510851e414fd398c6
```

You can create any file recognized by [node-config](http://lorenwest.github.io/node-config/). Currently JSON and YAML are supported.

## Plugin API

Plugins are used as intermediaries to web services.

*Coming Soon*
