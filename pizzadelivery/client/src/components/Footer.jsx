import React from "react";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* Logo / Title */}
          <div className="col-md-3 mb-4">
            <h4 className="footer-logo color">PizzaHub</h4>
          </div>

          {/* Menu */}
          <div className="col-md-2 mb-4">
            <h5 className="footer-title">Menu</h5>
            <ul className="list-unstyled">
              <li>Pizza</li>
              <li>Wraps</li>
              <li>Sea Food</li>
              <li>Calzones</li>
              <li>Ice creams</li>
            </ul>
          </div>

          {/* Restaurant */}
          <div className="col-md-2 mb-4">
            <h5 className="footer-title">Restaurent</h5>
            <ul className="list-unstyled">
              <li>About us</li>
              <li>Menu</li>
              <li>Specials & Coupons</li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-2 mb-4">
            <h5 className="footer-title">Support</h5>
            <ul className="list-unstyled">
              <li>How to order</li>
              <li>Where we deliver</li>
              <li>FAQs</li>
              <li>Contact us</li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">Opening Hours</h5>
            <ul className="list-unstyled">
              <li>Week days: 9:00 - 22:00</li>
              <li>Saturdays: 10:00 - 24:00</li>
              <li>Sundays: 11:00 - 23:00</li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="text-center mt-3">
          <small>
            Copyright 2025, PizzaHub Hub of Pizza, All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
