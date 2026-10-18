import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// 代码高亮主题（暗色，会在全局样式里覆盖背景以匹配金属暗黑风）
import 'highlight.js/styles/atom-one-dark.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
