/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
const PaymentWidget = ({ onPaymentMethodChange }) => {
  const handlePaymentMethodChange = (e) => {
    onPaymentMethodChange(e.target.id);
  };

  return (
    <div className="payment_widget">
      <div className="wrapper">
        <div className="form-check mb20">
          <input
            type="radio"
            name="paymentMethod"
            defaultChecked
            id="stripe"
            onChange={handlePaymentMethodChange}
          />
          <label className="form-check-label" htmlFor="stripe">
            Stripe
          </label>
        </div>
        {/* End form-check */}

        <div className="form-check">
          <input
            type="radio"
            name="paymentMethod"
            id="cashOnDelivery"
            onChange={handlePaymentMethodChange}
          />
          <label className="form-check-label" htmlFor="cashOnDelivery">
            Cash on Delivery
          </label>
        </div>
        {/* End form-check */}
      </div>
    </div>
  );
};

export default PaymentWidget;
