#!/usr/bin/env node

import program from 'commander';
import { version, description } from '../../package.json';

program
    .version(version)
    .description(description)
    .arguments('<firstConfig>')
    .arguments('<secondConfig>')
    .parse(process.argv);

if (!program.args.length) program.help();