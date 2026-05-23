import React, { useState } from "react";
import "./BookTable.css";
import { addressApi } from "../api/addresses";
import { useAuth } from "../context/AuthContext";

const Address = () => {
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Keep digits only — letters and symbols are silently dropped
      const digitsOnly = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("❌ Please log in to add an address.");
      return;
    }

    // Phone number length check (8–15 digits)
    if (!/^\d{8,15}$/.test(formData.phoneNumber)) {
      alert("❌ Please enter a valid phone number (8–15 digits).");
      return;
    }

    try {
      await addressApi.add({
        label: formData.name,
        fullAddress: formData.address,
        phoneNumber: formData.phoneNumber,
        isDefault: true,
      });

      setSuccess(true);
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
      });
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  return (
    <div className="book-table-section">
      <div className="book-table-inner">
        <div className="form-container">
          <div className="form-heading">
            <h2>Add Delivery Address</h2>
            <p>Please provide your delivery details below.</p>
          </div>

          {success && (
            <div className="address-success-msg">
              ✅ Address saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="name">Name</label>
              <input
                className="address-field"
                id="name"
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                required
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                className="address-field"
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                required
                inputMode="numeric"
                pattern="[0-9]{8,15}"
                maxLength="15"
                title="Phone number must contain digits only (8–15 digits)"
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input
                className="address-field"
                id="email"
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                required
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label htmlFor="address">Full Delivery Address</label>
              <textarea
                className="address-field"
                id="address"
                name="address"
                placeholder="Street, building, floor, and delivery notes"
                rows="3"
                value={formData.address}
                required
                onChange={handleChange}
              ></textarea>
            </div>

            <button className="save-address-button" type="submit">
              Save Address
            </button>
          </form>
        </div>

        <div className="map-container">
          <div className="map-label">
            <span className="map-label-title">Our Restaurant</span>
            <span className="map-label-text">
              {" "}
              — Orders are prepared and dispatched from this location.
            </span>
          </div>

          <iframe
            title="Tasty Bites location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d6624.855839362478!2d35.52922938721924!3d33.878631472740615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slb!4v1736581119645!5m2!1sen!2slb"
            width="100%"
            height="100%"
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Address;