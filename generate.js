const fs = require('fs');
const path = require('path');
const reduce = require('lodash.reduce');
const loadRules = require('eslint/lib/load-rules');

const packages = [
  'eslint',
];
const toJSON = data => JSON.stringify(data, null, 2);

packages.forEach(package => {
  const version = require(`${package}/package.json`).version;
  const rules = loadRules(`node_modules/${package}/lib/rules`, __dirname);
  const definitions = reduce(rules, (defs, filepath, name) => {
    const rule = require(filepath);
    const schemata = rule.meta.schema;
    defs[name] = rule.meta.schema;
    return defs;
  }, {});

  const dir = path.join(__dirname, package, version);

  try {
    fs.mkdirSync(dir);
  } catch(err) { }

  fs.writeFileSync(path.join(dir, 'schema.json'), toJSON(definitions));
});

