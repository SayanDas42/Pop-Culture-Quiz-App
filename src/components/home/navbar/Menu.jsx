import './styles/Menu.css'
import { NavLink } from "react-router";
function Menu(){
    return(
        <div className = "Menu">
            <NavLink to = "/" className = "menu-item">Home</NavLink>
            <div className = "menu-item">About</div>
            <div className = "menu-item">Socials</div>
            <div className = "menu-item">Support Me</div>
        </div>
    )
}
export default Menu