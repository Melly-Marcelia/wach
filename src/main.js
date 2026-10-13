import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles/tokens.css'
import './styles/base.css'
import './styles/utilities.css'
import UiButton from './components/ui/UiButton.vue'
import UiCard from './components/ui/UiCard.vue'
import UiChip from './components/ui/UiChip.vue'
import UiIconWell from './components/ui/UiIconWell.vue'
import UiListRow from './components/ui/UiListRow.vue'
import UiSectionHeader from './components/ui/UiSectionHeader.vue'
import UiToggle from './components/ui/UiToggle.vue'

const app = createApp(App).use(router)
// Base UI components are used on every screen, so they are registered once here.
Object.entries({ UiButton, UiCard, UiChip, UiIconWell, UiListRow, UiSectionHeader, UiToggle }).forEach(([n, c]) => app.component(n, c))
app.mount('#app')
