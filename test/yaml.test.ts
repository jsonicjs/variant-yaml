/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */


import { Jsonic, Rule } from 'jsonic'
import { Yaml } from '../yaml'




describe('yaml', () => {

  test('happy', () => {
    const j = Jsonic.make().use(Yaml)

    expect(j(`a: 1
b: 2
c:
  d: 3
  e: 4
  f:
  - g
  - h
`)).toEqual({ a: 1, b: 2, c: { d: 3, e: 4, f: ['g', 'h'] } })

  })

})


