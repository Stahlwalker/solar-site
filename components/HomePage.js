import { defineComponent, registry, h } from '../solar/index.js'
import './Nav.js'
import './Hero.js'
import './Features.js'
import './CodeExample.js'
import './SiteFooter.js'

const HomePage = defineComponent({
  name: 'HomePage',
  props: {},
  render() {
    return h(['div', { class: 'page' },
      ['div', { class: 'container' },
        ['Nav', {}],
        ['Hero', {}],
        ['Features', {}],
        ['CodeExample', {}],
        ['SiteFooter', {}],
      ],
    ])
  },
})

registry.register(HomePage)
export default HomePage
