import _ from 'lodash';
import convertJSONToObject from './parsers';

const before = 'before';
const after = 'after';
const status = 'status';

const buildAst = (path1, path2) => {
  const object1 = convertJSONToObject(path1);
  const object2 = convertJSONToObject(path2);

  const objectBefore = Object.keys(object1)
    .reduce((acc, item) => ({ ...acc, [item]: { [before]: object1[item] } }), {});
  const objectAfter = Object.keys(object2)
    .reduce((acc, item) => ({ ...acc, [item]: { [after]: object2[item] } }), {});
  const mergingRule = (obj1, obj2) => ({ ...obj1, ...obj2 });
  const objectMerged = _.mergeWith(objectBefore, objectAfter, mergingRule);

  const tree = Object.keys(objectMerged).reduce((acc, item) => {
    const hasBeforeValue = Object.prototype.hasOwnProperty.call(objectMerged[item], before);
    const hasAfterValue = Object.prototype.hasOwnProperty.call(objectMerged[item], after);
    if (hasBeforeValue && hasAfterValue
        && objectMerged[item][before] === objectMerged[item][after]) {
      return { ...acc, [item]: { ...objectMerged[item], [status]: 'unchanged' } };
    } if (hasAfterValue && hasBeforeValue) {
      return { ...acc, [item]: { ...objectMerged[item], [status]: 'changed' } };
    } if (hasBeforeValue) {
      return { ...acc, [item]: { ...objectMerged[item], [status]: 'deleted' } };
    }
    return { ...acc, [item]: { ...objectMerged[item], [status]: 'added' } };
  }, {});

  return tree;
};

const renderAst = (ast) => {
  const generateOutputText = (acc, item) => {
    const accPlusNewline = !acc ? `{\n${acc}` : `${acc}\n`;
    const lineBefore = `${item}: ${ast[item][before]}`;
    const lineAfter = `${item}: ${ast[item][after]}`;

    switch (ast[item][status]) {
      case 'unchanged':
        return `${accPlusNewline}    ${lineBefore}`;
      case 'changed':
        return `${accPlusNewline}  + ${lineAfter}\n  - ${lineBefore}`;
      case 'deleted':
        return `${accPlusNewline}  - ${lineBefore}`;
      case 'added':
        return `${accPlusNewline}  + ${lineAfter}`;
      default:
        throw new Error('Unexpected status');
    }
  };

  const textOutput = Object.keys(ast).reduce(generateOutputText, '').concat('\n}');
  return textOutput;
};

export default (path1, path2) => {
  const ast = buildAst(path1, path2);
  return renderAst(ast);
};
