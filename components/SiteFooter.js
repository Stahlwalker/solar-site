import { defineComponent, registry, h } from '../solar/index.js'

const SiteFooter = defineComponent({
  name: 'SiteFooter',
  props: {},
  render() {
    return h(['footer', { class: 'site-footer' },
      ['div', { class: 'footer-links' },
        ['a', { class: 'footer-link', href: 'https://docs.solarbuild.dev/' }, 'Documentation'],
      ],
      ['p', { class: 'footer-copy' }, '© 2026 Solar. Built by ', ['a', { href: 'https://lukestahl.io/', target: '_blank', rel: 'noopener noreferrer' }, 'Luke Stahl'], '.'],
    ])
  },
})

registry.register(SiteFooter)
export default SiteFooter
