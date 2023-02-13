import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
const Home = (props) => {
    return (
        <div >
            <div className="banner-container">
            <div className="text-center">
                    <h1>WARNING</h1>
                    <h6>It is not recommended to use this on a live system unless you specifically know how to use the MCS API.</h6>
                </div>
            </div>
        </div>
    );
};
export default Home;