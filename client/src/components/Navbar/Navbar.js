import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const Navbar = () => {
    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">BREAK EVERYTHING</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Get Receivers</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="#">Delete Senders</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="#">Modify Bandwidth of a Sender</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="#">Add Customer Sender</a>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;