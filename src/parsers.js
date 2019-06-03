import { readFileSync } from 'fs';
// import yaml from 'js-yaml';

const convertJSONToObject = (path) => {
  const rawdata = readFileSync(path);
  const file = JSON.parse(rawdata);
  return file;
};

export default convertJSONToObject;
