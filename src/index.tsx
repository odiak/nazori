import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

const e = document.getElementById('app')
if (e === null) throw new Error('No #app element')

createRoot(e).render(<App />)
