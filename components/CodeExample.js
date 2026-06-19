import { defineComponent, registry, h } from '../solar/index.js'

const code = "import { defineComponent, registry, h } from '../solar/index.js'\n\nconst Button = defineComponent({\n  name: 'Button',\n  props: {\n    label:   { type: 'string', required: true  },\n    variant: { type: 'string', required: false },\n  },\n  render({ label, variant = 'primary' }) {\n    return h(['button', { class: `btn btn--${variant}` }, label])\n  },\n})\n\nregistry.register(Button)\nexport default Button"

const CodeExample = defineComponent({
  name: 'CodeExample',
  props: {},
  render() {
    return h(['section', { class: 'section' },
      ['div', { class: 'section__header' },
        ['span', { class: 'label' }, 'Component API'],
        ['h2', { class: 'section__title' }, 'Write once. Agents understand forever.'],
        ['p', { class: 'section__sub' },
          'Solar components are explicit contracts. The registry, typed props, and structured errors mean agents can read, write, and fix your UI without a compiler.',
        ],
      ],
      ['div', { class: 'code-block' },
        ['div', { class: 'code-block__bar' },
          ['span', { class: 'code-block__dot', style: 'background:#ff5f57' }],
          ['span', { class: 'code-block__dot', style: 'background:#febc2e' }],
          ['span', { class: 'code-block__dot', style: 'background:#28c840' }],
          ['span', { class: 'code-block__filename' }, 'components/Button.js'],
        ],
        ['pre', { class: 'code-block__pre language-javascript' },
          ['code', { class: 'language-javascript' }, code],
        ],
      ],
    ])
  },
})

registry.register(CodeExample)
export default CodeExample
