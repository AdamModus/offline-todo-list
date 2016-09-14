'use strict';

var fs = require('fs');
var express = require('express');
var ArgumentParser = require('argparse').ArgumentParser;

/**
 * Surviving Offline Server
 *
 * Simple static files server using node and Express.
 */
class SurvivingOfflineServer {
  /**
   * Creates an argument parser with:
   * - Description
   * - Help argument
   * - Port argument
   */
  initArgumentParser() {
    // Create an argument parser
    this.argParser = new ArgumentParser(
      {
        version: '0.0.1',
        addHelp: true,
        description: 'Surviving to the offline status NodeJS server.'
      }
    );
    // Define the port argument
    this.argParser.addArgument(['-p', '--port'], {
      help: 'Port on where to run the server.',
      type: 'int',
      defaultValue: '8888'
    });
    // Get the arguments
    this.arguments = this.argParser.parseArgs();
  }

  /**
   * Crates the Express app and sets up the middleware to:
   * - Log the requests in the terminal.
   * - Serve the static files located in "../app"
   */
  createApp() {
    // Create a new express app
    this.app = express();
    // Log the requests
    this.app.use(function logger(req, res, next) {
      console.log('serving ' + req.url);
      next(); // Passing the request to the next handler in the stack.
    });
    // Configure the static files
    this.app.use(express.static('../app'));
  }

  /**
   * Starts a http server in the port specified in the arguments or 8888
   */
  startServing() {
    let serverPort = this.arguments.port;
    // Listen on the current port
    this.app.listen(serverPort, function () {
      console.log('Server listening on port: ', serverPort);
    })
  }

  constructor() {
    this.initArgumentParser();
    this.createApp();
    this.startServing();
  }
}

var server = new SurvivingOfflineServer();
