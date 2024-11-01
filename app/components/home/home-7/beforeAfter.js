/* eslint-disable react/prop-types */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { MoveHorizontal } from 'lucide-react'
import PropTypes from 'prop-types'

export default function BeforeAfter({
  beforeImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwRPWpO-12m19irKlg8znjldmcZs5PO97B6A&s",
  afterImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwRPWpO-12m19irKlg8znjldmcZs5PO97B6A&s",
  height=300,
  width=400,
}) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handleMove = (clientX) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const position = (x / rect.width) * 100
      setSliderPosition(Math.min(Math.max(position, 0), 100))
    }
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  const handleTouchMove = (e) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX)
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className="relative select-none touch-none overflow-hidden rounded-lg shadow-lg"
      style={{ height, width }}
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <Image
          src={beforeImage}
          alt="Before"
          layout="fill"
          className="object-cover"
        />
      </div>

      {/* After Image */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <Image
          src={afterImage}
          alt="After"
          layout="fill"
          className="object-cover"
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <MoveHorizontal className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </div>
  )
}

BeforeAfter.propTypes = {
  beforeImage: PropTypes.string,
  afterImage: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
}

BeforeAfter.defaultProps = {
  beforeImage: '/placeholder.svg?height=400&width=600&text=Before',
  afterImage: '/placeholder.svg?height=400&width=600&text=After',
  height: 400,
  width: 600,
}
