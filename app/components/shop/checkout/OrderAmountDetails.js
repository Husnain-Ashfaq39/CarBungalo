/* eslint-disable react/prop-types */
'use client';
/* eslint-disable react/react-in-jsx-scope */
import useCartStore from '@/utils/store/cartStore';
import Coupon from '../cart/Coupon';
import { useState, useEffect, memo } from 'react';

const OrderAmountDetails = memo(({ onOrderDetailsChange }) => {
  const { items } = useCartStore();
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + (price * item.quantity);
  }, 0);

  const deliveryFee = 10.00;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + deliveryFee - discountAmount;

  useEffect(() => {
    const orderDetails = {
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
    };

    onOrderDetailsChange(orderDetails);
  }, [items, subtotal, deliveryFee, discount, total, onOrderDetailsChange]);

  if (!items || items.length === 0) {
    return <div>No items in cart</div>;
  }

  return (
    <>
      <ul>
        <li className="subtitle">
          <p>
            Product <span className="float-end">Subtotal</span>
          </p>
        </li>
        {items.map((item, index) => (
          <li key={`${item.id}-${index}`}>
            <p className="product_name_qnt">
              {item.name.split(' ').slice(0, 2).join(' ')} x{item.quantity} <span className="float-end">${((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
            </p>
          </li>
        ))}
        <li className="subtitle">
          <p>
            Subtotal <span className="float-end totals">${subtotal.toFixed(2)}</span>
          </p>
        </li>
        <li className="subtitle">
          <p>
            Delivery Fee <span className="float-end totals">${deliveryFee.toFixed(2)}</span>
          </p>
        </li>
        {discount > 0 && (
          <li className="subtitle">
            <p>
              Discount <span className="float-end totals">-${discountAmount.toFixed(2)}</span>
            </p>
          </li>
        )}
        <li className="subtitle">
          <p>
            Total <span className="float-end totals">${total.toFixed(2)}</span>
          </p>
        </li>
      </ul>

      <Coupon onApplyDiscount={setDiscount} />
    </>
  );
});

OrderAmountDetails.displayName = 'OrderAmountDetails';

export default OrderAmountDetails;
