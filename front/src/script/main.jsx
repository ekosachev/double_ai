import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '../css/index.css'
import Header from './Header.jsx'
import Menu from "./Menu.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Header/>
        <Menu/>
    </StrictMode>,
)
