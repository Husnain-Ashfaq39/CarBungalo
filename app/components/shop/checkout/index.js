/* eslint-disable react/react-in-jsx-scope */
'use client';
import { useState } from 'react';
import BillingDetails from "./BillingDetails";
import OrderAmountDetails from "./OrderAmountDetails";
import PaymentWidget from "./PaymentWidget";

const BillingMain = () => {
  const [billingInfo, setBillingInfo] = useState({});
  const [orderDetails, setOrderDetails] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const handlePlaceOrder = () => {
    const orderData = {
      billingInfo,
      orderDetails,
      paymentMethod,
    };

    // Call your API here with orderData
    console.log('Order Data:', orderData);
  };

  return (
    <>
      <div className="col-lg-8">
        <div className="checkout_form style2">
          <h4 className="title mb30">Billing details</h4>
          <BillingDetails onBillingInfoChange={setBillingInfo} />
        </div>
      </div>
      {/* End billing content */}

      <div className="col-lg-4">
        <div className="order_sidebar_widget mb30">
          <h4 className="title">Your Order</h4>
          <OrderAmountDetails onOrderDetailsChange={setOrderDetails} />
        </div>
        {/* End your order */}

        <PaymentWidget onPaymentMethodChange={setPaymentMethod} />
        <div className="ui_kit_button payment_widget_btn">
          <button type="button" className="btn btn-thm btn-block" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </>
  );
};

export default BillingMain;
