#!/usr/bin/env node

import program from 'commander';
import { version, description } from '../../package.json';
import genDiff from '..';

program
  .version(version)
  .description(description)
  .arguments('<firstConfig>')
  .arguments('<secondConfig>')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv)
  .action((json1, json2) => console.log(genDiff(json1, json2)))
  .parse(process.argv);

if (!program.args.length) program.help();
