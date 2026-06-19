import { defineComponent, registry, h } from '../solar/index.js'

const Hero = defineComponent({
  name: 'Hero',
  props: {},
  render() {
    return h(['section', { class: 'hero' },
      ['div', { class: 'orbit-ring' },
        ['div', { class: 'orbit-core' }],
      ],
      ['span', { class: 'label' }, 'Runtime Framework'],
      ['h1', {}, 'UI for the age of AI-generated code'],
      ['p', { class: 'hero-sub' },
        'Solar runs directly in the browser — no compiler, no build step. Explicit props, a component registry, and structured error responses give agents the predictable contract they need.',
      ],
      ['div', { class: 'cta-row' },
        ['a', { class: 'btn btn--primary', href: 'https://docs.solarbuild.dev/' }, 'Read the docs →'],
        ['a', { class: 'btn btn--secondary', href: 'https://github.com/Stahlwalker/framework-solar' }, 'View on GitHub'],
      ],
    ])
  },
})

registry.register(Hero)
export default Hero
