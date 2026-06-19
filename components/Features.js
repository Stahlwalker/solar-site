import { defineComponent, registry, h } from '../solar/index.js'

const features = [
  {
    icon: '⚡',
    title: 'No compiler required',
    body: 'Code runs instantly in the browser. No build step means faster iteration, complete debuggability, and zero toolchain friction.',
  },
  {
    icon: '📋',
    title: 'Explicit contracts',
    body: 'Every prop is typed and validated at runtime. Agents receive structured JSON errors they can parse, understand, and fix autonomously.',
  },
  {
    icon: '🗂️',
    title: 'Component registry',
    body: "Every component is automatically registered and addressable by name. Agents always have a complete map of what's in your app.",
  },
  {
    icon: '🔗',
    title: 'Declared dependencies',
    body: 'Effects state their dependencies explicitly. Data flow is always readable, predictable, and safe to modify programmatically.',
  },
]

const Features = defineComponent({
  name: 'Features',
  props: {},
  render() {
    return h(['section', { class: 'section' },
      ['div', { class: 'section__header' },
        ['span', { class: 'label' }, 'Core principles'],
        ['h2', { class: 'section__title' }, 'Built for agents. Readable by humans.'],
        ['p', { class: 'section__sub' },
          'Every design decision in Solar optimizes for the new reality: code is increasingly written, modified, and debugged by AI.',
        ],
      ],
      ['div', { class: 'features-grid' },
        ...features.map(f =>
          h(['div', { class: 'feature-card' },
            ['div', { class: 'feature-card__icon' }, f.icon],
            ['p', { class: 'feature-card__title' }, f.title],
            ['p', { class: 'feature-card__body' }, f.body],
          ])
        ),
      ],
    ])
  },
})

registry.register(Features)
export default Features
