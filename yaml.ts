/* Copyright (c) 2021 Richard Rodger, MIT License */


import {
  Jsonic,
  Rule,
  RuleSpec,
  Plugin,
  Config,
  Options,
  Lex,
  Context,
} from 'jsonic'


type YamlOptions = {
}


const Yaml: Plugin = (jsonic: Jsonic, options: YamlOptions) => {
  let TX = jsonic.token.TX
  let CL = jsonic.token.CL

  let IN = jsonic.token('#IN')

  jsonic.options({
    fixed: {
      token: {
        '#CL': null,
        '#EL': '-',
      }
    },
    ender: ':'
  })

  let EL = jsonic.token('#EL')


  // console.log(jsonic.internal().config.fixed)

  jsonic.lex((_cfg: Config, _opts: Options) => {

    return (lex: Lex) => {
      let pnt = lex.pnt
      let fwd = lex.src.substring(pnt.sI)

      let colon = fwd.match(/^:( |\r?\n)/)
      if (colon) {
        let len = colon[0].length
        let tkn = lex.token('#CL', len, colon[0], lex.pnt)
        pnt.sI += 1 // NOTE: don't consume newline! leave it for #IN
        pnt.rI += ' ' != colon[1] ? 1 : 0
        pnt.cI += ' ' == colon[1] ? 2 : 0
        return tkn
      }

      let spaces = fwd.match(/^\r?\n +/)
      if (spaces) {
        let len = spaces[0].length
        let tkn = lex.token('#IN', len, spaces[0], lex.pnt)
        pnt.sI += len
        pnt.rI += 1
        pnt.cI = len
        return tkn
      }
    }
  })

  jsonic.rule('val', (rulespec: RuleSpec) => {
    rulespec.open([
      {
        s: [IN],
        p: 'indent',
        a: (rule: Rule) => rule.n.in = rule.open[0].val
      },
      {
        s: [EL],
        p: 'list',
      }
    ])
  })

  jsonic.rule('indent', (rulespec: RuleSpec) => {
    rulespec
      .open([
        {
          s: [TX, CL],
          p: 'map',
          b: 2,
        },
        {
          s: [EL],
          p: 'list',
        }
      ])
      .bc((rule: Rule) => rule.node = rule.child.node)
  })

  jsonic.rule('map', (rulespec: RuleSpec) => {
    rulespec.open([
      {
        s: [IN],
        c: (rule: Rule) => rule.open[0].val === rule.n.in,
        r: 'pair',
      },
    ])
  })

  jsonic.rule('pair', (rulespec: RuleSpec) => {
    rulespec.close([
      {
        s: [IN],
        c: (rule: Rule, ctx: Context) => {
          // console.log('WWW',ctx.t0, rule.n)
          return ctx.t0.val === rule.n.in
        },
        r: 'pair',
      },
    ])
  })

  jsonic.rule('elem', (rulespec: RuleSpec) => {
    rulespec.close([
      {
        s: [IN, EL],
        c: (rule: Rule, ctx: Context) => {
          // console.log('WWW',ctx.t0, rule.n)
          return ctx.t0.val === rule.n.in
        },
        r: 'elem',
      },
      {
        s: [EL],
        c: (rule: Rule, _ctx: Context) => {
          return !!rule.n.in  // NOTE: no indent as either 0 or undef
        },
        r: 'elem',
      },
    ])
  })

}


Yaml.defaults = ({
} as YamlOptions)


export {
  Yaml,
}

export type {
  YamlOptions,
}
