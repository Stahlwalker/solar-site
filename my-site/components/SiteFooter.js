import { defineComponent, registry, h } from '../solar/index.js'

const SiteFooter = defineComponent({
  name: 'SiteFooter',
  props: {},
  render() {
    return h(['footer', { class: 'site-footer' },
      ['div', { class: 'footer-links' },
        ['a', { class: 'footer-link', href: 'https://docs.solarbuild.dev/' }, 'Documentation'],
      ],
      ['p', { class: 'footer-copy' }, '© 2026 Solar. Built with Solar.'],
    ])
  },
})

registry.register(SiteFooter)
export default SiteFooter
