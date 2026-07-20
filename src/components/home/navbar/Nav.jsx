import Logo from './Logo'
import Menu from './Menu'
import './styles/Nav.css'
function Nav(){
    return(
        <div className = "NavBar">
            <Logo/>
            <Menu/>
        </div>
    )
}
export default Nav