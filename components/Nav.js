import { defineComponent, registry, h } from '../solar/index.js'

const Nav = defineComponent({
  name: 'Nav',
  props: {},
  render() {
    return h(['nav', { class: 'site-nav' },
      ['a', { class: 'nav-logo', href: '/' },
        ['div', { class: 'logo-mark' }],
        ['span', { class: 'logo-text' }, 'Solar'],
      ],
      ['div', { class: 'nav-links' },
        ['a', { class: 'nav-link nav-link--cta', href: 'https://docs.solarbuild.dev/' }, 'Docs →'],
      ],
    ])
  },
})

registry.register(Nav)
export default Nav
