import Scrollbar from "simplebar-react";
import {Link} from "react-router-dom";
import MenuItem from "./MenuItem";
import { sidebarConfig } from "../../Data/Sidebar/sidebar";

const Sidebar = ({sidebarOpen, setIsSidebarOpen, handleNavClick}) => {
    return (
        <nav className={`vertical-sidebar ${sidebarOpen ? "semi-nav" : ""}`}>
            <div className="app-logo">
              
            </div>
            <Scrollbar className="app-nav simplebar-scrollable-y" id="app-simple-bar">
                <ul className="main-nav p-0 mt-2">
                    {sidebarConfig.map((config, index) => (
                        <MenuItem key={index} {...config} handleNavClick={handleNavClick} />
                    ))}
                </ul>
            </Scrollbar>
            
        </nav>
    );
};

export default Sidebar;