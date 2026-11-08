import React, { useState } from 'react'

export default function ReviewItem({ index, review }) {

  return (
        <div
            key={index}
            className="p-4 border border-gray-100 rounded-lg shadow-lg bg-white"
          >
            <div className='flex flex-row justify-between items-center'>
            <p className="text-yellow-500">
              {"★".repeat(review.rating)}{" "}
              {/*
              <span className="text-gray-500">
              ({review.rating})
              </span>
              */}
            </p>
              <h3 className="text-lg font-bold text-gray-900">{review.name}</h3>
            </div>
            <div className={`flex flex-row mt-2 ${review.langue == "ar" ? "justify-end" : "justify-start"}`}>
                <p className='text-gray-600 font-semibold' style={{ whiteSpace: "pre-line" }}>{review.comment}</p>
            </div>
          </div>
  )
}
