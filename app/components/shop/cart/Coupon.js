/* eslint-disable react/prop-types */
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { Check } from 'lucide-react'
import db from '@/utils/appwrite/Services/dbServices'
import { Query } from 'appwrite'

// Function to fetch and validate coupon from Appwrite database
const validateCoupon = async (code) => {
  try {
    const response = await db.Vouchers.list([Query.equal('code', code)])
    if (response.documents.length > 0) {
      const coupon = response.documents[0]
      // Check if the coupon is still valid based on usage limit
      if (coupon.count >= coupon.usageLimit) {
        coupon.valid = false
      }
      return coupon
    }
  } catch (error) {
    console.error("Error fetching coupon:", error)
  }
  return null
}

const Coupon = ({ onApplyDiscount }) => {
  const [couponCode, setCouponCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [couponResult, setCouponResult] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await validateCoupon(couponCode)
    setIsLoading(false)
    setCouponResult(result)
    if (result?.valid) {
      setShowConfetti(true)
      onApplyDiscount(result.discountValue)
      // Increment the count for the coupon and update validity
      try {
        const newCount = result.count + 1
        const isValid = newCount < result.usageLimit
        await db.Vouchers.update(result.$id, { count: newCount, valid: isValid })
      } catch (error) {
        console.error("Error updating coupon count:", error)
      }
      setTimeout(() => setShowConfetti(false), 5000) // Stop confetti after 5 seconds
    } else {
      onApplyDiscount(0)
    }
  }

  return (
    <div className="relative">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <form onSubmit={handleSubmit} className="df db-sm my-2">
        <input
          className="form-control coupon_input me-2"
          type="search"
          placeholder="Enter your magic code here..."
          aria-label="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button type="submit" className="btn btn-thm btn-xs" disabled={isLoading}>
          {isLoading ? 'Applying...' : 'Apply'}
        </button>
      </form>
      <AnimatePresence>
        {couponResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`p-4 rounded-md mt-2 ${
              couponResult.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {couponResult.valid ? (
              <div className="flex items-center">
                <Check className="w-6 h-6 mr-2" />
                <span>Congratulations! You got {couponResult.discountValue}% off!</span>
              </div>
            ) : (
              <span>Invalid coupon code. Please try again.</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Coupon
