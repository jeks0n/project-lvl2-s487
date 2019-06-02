import { readFileSync } from 'fs';
import _ from 'lodash';

const convertJSONToObject = (path) => {
    const rawdata = readFileSync(path);
    const file = JSON.parse(rawdata);
    return file;
};

const genDiff = (path1, path2) => {
    const object1 = convertJSONToObject(path1);
    const object2 = convertJSONToObject(path2);

    const objectBefore = Object.keys(object1)
        .reduce((acc, item) => ({ ...acc, [item]: { 'before': object1[item]}}), {});
    const objectAfter = Object.keys(object2)
        .reduce((acc, item) => ({ ...acc, [item]: { 'after': object2[item]}}), {});
    const mergingRule = (object1, object2) => {
        return { ...object1, ...object2 };
    };
    const objectMerged = _.mergeWith(objectBefore, objectAfter, mergingRule);

    const generateOutputText = (acc, item) => {
        const accPlusNewline = !acc ? `{\n${acc}` : `${acc}\n`;
        const lineBefore = `${item}: ${objectMerged[item].before}`;
        const lineAfter = `${item}: ${objectMerged[item].after}`;
        const hasBeforeValue = objectMerged[item].hasOwnProperty('before');
        const hasAfterValue = objectMerged[item].hasOwnProperty('after');
        let newAcc;
        if (hasBeforeValue && hasAfterValue && objectMerged[item].before === objectMerged[item].after) {
            newAcc = `${accPlusNewline}    ${lineBefore}`;
        } else if (hasAfterValue && hasBeforeValue) {
            newAcc = `${accPlusNewline}  + ${lineAfter}\n  - ${lineBefore}`;
        } else if (hasBeforeValue) {
            newAcc = `${accPlusNewline}  - ${lineBefore}`;
        } else {
            newAcc = `${accPlusNewline}  + ${lineAfter}`;
        }
        return newAcc;
    };

    const textOutput = Object.keys(objectMerged).reduce(generateOutputText, '').concat('\n}');
    return textOutput;
};

export default genDiff;
