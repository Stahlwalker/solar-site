import { defineComponent, registry, h } from '../solar/index.js'

const Nav = defineComponent({
  name: 'Nav',
  props: {},
  render() {
    return h(['nav', { class: 'site-nav' },
      ['a', { class: 'nav-logo', href: '/' },
        ['img', { src: './logo/new-logo/dark.svg', alt: 'Solar', height: '32' }],
      ],
      ['div', { class: 'nav-links' },
        ['a', { class: 'nav-link nav-link--cta', href: 'https://docs.solarbuild.dev/docs/introduction' }, 'Docs →'],
      ],
    ])
  },
})

registry.register(Nav)
export default Nav
