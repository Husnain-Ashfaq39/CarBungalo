/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
'use client';
import React, { useState } from 'react';
import Select from 'react-select';
import ReactCountryFlag from 'react-country-flag';
import { countryOptions } from './countryData'; // Adjust the path as needed

const BillingDetails = ({ onBillingInfoChange }) => {
  const [country, setCountry] = useState(null);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({ line1: '', line2: '' });
  const [billingAddress, setBillingAddress] = useState({ line1: '', line2: '' });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [email, setEmail] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const options = countryOptions.map(country => ({
    value: country.value,
    label: (
      <div>
        <ReactCountryFlag countryCode={country.value} svg style={{ marginRight: '10px' }} />
        {country.label} (+{country.phoneCode})
      </div>
    ),
  }));

  const handleChange = selectedOption => {
    setCountry(selectedOption);
    setPhone(''); // Reset phone number when country changes
    setError(''); // Clear any existing errors
    handleFormChange();
  };

  const handlePhoneChange = (e) => {
    const inputPhone = e.target.value;
    setPhone(inputPhone);

    if (country && country.value === 'PK') {
      const pakistanPhoneRegex = /^(\+92|0)?3[0-9]{2}[0-9]{7}$/; // Example regex for Pakistan
      if (!pakistanPhoneRegex.test(inputPhone)) {
        setError('Please enter a valid Pakistani phone number.');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
    handleFormChange();
  };

  const handleDeliveryAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));

    if (useSameAddress) {
      setBillingAddress(prev => ({ ...prev, [name]: value }));
    }
    handleFormChange();
  };

  const handleBillingAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({ ...prev, [name]: value }));
    handleFormChange();
  };

  const handleCheckboxChange = () => {
    setUseSameAddress(!useSameAddress);
    if (!useSameAddress) {
      setBillingAddress(deliveryAddress);
    } else {
      setBillingAddress({ line1: '', line2: '' }); // Clear billing address when unchecked
    }
    handleFormChange();
  };

  const handleFormChange = () => {
    const billingInfo = {
      firstName,
      lastName,
      country,
      phone,
      deliveryAddress,
      billingAddress,
      postcode,
      city,
      region,
      email,
      orderNotes,
     
    };
    onBillingInfoChange(billingInfo);
  };

  return (
    <div className="checkout_coupon ui_kit_button">
      <form className="form2">
        <div className="row">
          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">First name *</label>
              <input
                className="form-control form_control"
                type="text"
                placeholder="Ali Tuf.."
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  handleFormChange();
                }}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">Last name *</label>
              <input 
                className="form-control form_control" 
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  handleFormChange();
                }}
              />
            </div>
          </div>


          <div className="col-lg-12">
            <div className="mb30">
              <label className="form-label">Country / Region *</label>
              <div className="checkout_country_form actegory">
                <Select
                  options={options}
                  value={country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-12">
            <div className="mb30">
              <label className="form-label">Delivery address *</label>
              <input
                className="form-control form_control mb10"
                type="text"
                name="line1"
                value={deliveryAddress.line1}
                onChange={handleDeliveryAddressChange}
              />
              <input
                className="form-control form_control"
                type="text"
                name="line2"
                value={deliveryAddress.line2}
                onChange={handleDeliveryAddressChange}
              />
            </div>
          </div>

          <div className="col-sm-12">
            <div className="mb30">
              <div className='flex justify-between'>
                <label className="form-label mt-3">Billing address *</label>
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={useSameAddress}
                    onChange={handleCheckboxChange}
                    className="me-2"
                  />
                  <label className="form-label mb-0">Use same as delivery address</label>
                </div>
              </div>

              <input
                className="form-control form_control mb10"
                type="text"
                name="line1"
                value={billingAddress.line1}
                onChange={handleBillingAddressChange}
                disabled={useSameAddress}
              />
              <input
                className="form-control form_control"
                type="text"
                name="line2"
                value={billingAddress.line2}
                onChange={handleBillingAddressChange}
                disabled={useSameAddress}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">Postcode / ZIP *</label>
              <input 
                className="form-control form_control" 
                type="text"
                value={postcode}
                onChange={(e) => {
                  setPostcode(e.target.value);
                  handleFormChange();
                }}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">Town / City *</label>
              <input 
                className="form-control form_control" 
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  handleFormChange();
                }}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">Region *</label>
              <input 
                className="form-control form_control" 
                type="text"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  handleFormChange();
                }}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">Phone *</label>
              <input
                className="form-control form_control"
                type="text"
                value={phone}
                onChange={handlePhoneChange}
              />
              {error && <p className="text-danger">{error}</p>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-12">
            <div className="mb30">
              <label className="form-label">Your Email</label>
              <input 
                className="form-control form_control" 
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleFormChange();
                }}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-12">
            <div className="mb30 mb0">
              <label className="form-label ai_title">
                Order notes (optional)
              </label>
              <textarea
                name="form_message"
                className="form-control"
                rows={12}
                value={orderNotes}
                onChange={(e) => {
                  setOrderNotes(e.target.value);
                  handleFormChange();
                }}
              />
            </div>
          </div>
          {/* End .col */}
        </div>
      </form>
    </div>
  );
};

export default BillingDetails;
