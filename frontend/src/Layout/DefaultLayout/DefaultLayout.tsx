import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import SideBar from '../../Components/SideBar';

function DefaultLayout({ children }: { children: ReactNode }) {
    return (  
        <div>
            <SideBar></SideBar>
            <div>{children}</div> 
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
