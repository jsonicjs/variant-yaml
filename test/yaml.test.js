"use strict";
/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
const jsonic_1 = require("jsonic");
const yaml_1 = require("../yaml");
describe('yaml', () => {
    test('happy', () => {
        const j = jsonic_1.Jsonic.make().use(yaml_1.Yaml);
        expect(j(`a: 1
b: 2
c:
  d: 3
  e: 4
  f:
  - g
  - h
`)).toEqual({ a: 1, b: 2, c: { d: 3, e: 4, f: ['g', 'h'] } });
    });
});
//# sourceMappingURL=yaml.test.js.map