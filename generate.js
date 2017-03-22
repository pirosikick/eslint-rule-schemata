const fs = require('fs');
const path = require('path');
const reduce = require('lodash.reduce');
const forEach = require('lodash.foreach');
const loadRules = require('eslint/lib/load-rules');
const baseSchema = require('./schema.json');

const packages = [
  'eslint',
];
const toPrettyJSON = data => JSON.stringify(data, null, 2);

packages.forEach(package => {
  const version = require(`${package}/package.json`).version;
  const dir = path.join(__dirname, package, version, 'rules');

  try {
  fs.mkdirSync(dir);
  } catch (err) { }

  const rules = loadRules(`node_modules/${package}/lib/rules`, __dirname);

  forEach(rules, (filepath, name) => {
    const rule = require(filepath);
    const schema = rule.meta.schema;
    fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(schema));
    fs.writeFileSync(path.join(dir, `${name}-pretty.json`), toPrettyJSON(schema));
  });
});
