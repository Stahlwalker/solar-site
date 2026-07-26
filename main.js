import { mountComponent } from './solar/index.js'
import HomePage from './components/HomePage.js'

const appEl = document.getElementById('app')
appEl.innerHTML = ''
mountComponent(HomePage, {}, appEl)

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]')
  if (!link) return

  const href = link.getAttribute('href')
  const cls = link.className || ''

  if (href === 'https://docs.solarbuild.dev/') {
    const location = cls.includes('nav-link') ? 'nav'
      : cls.includes('built-badge') ? 'badge'
      : 'hero'
    window.posthog?.capture('docs_clicked', { location })
  } else if (href === 'https://github.com/Stahlwalker/framework-solar') {
    window.posthog?.capture('github_clicked', { location: 'hero' })
  }
})
