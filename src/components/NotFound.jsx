import { BadgeX, CircleOff, PanelRightClose } from 'lucide-react'
import React from 'react'

function NotFound({ type }) {
  return (
    <>
    <div className='w-full flex flex-col justify-center gap-2 items-center py-6'>
        {type == "categories" ? <>
            <BadgeX className='text-gray-500' size={40} />
            <h2 className='text-gray-500 font-bold text-3xl'>لا توجد أصناف حاليا</h2>
        </>
        : type == "featured" ? <>
            <BadgeX className='text-gray-500' size={40} />
            <h2 className='text-gray-500 font-bold text-3xl'>لا توجد منتجات مميزة حاليا </h2>
        </>
        : type == "reviews" ? <>
            <BadgeX className='text-gray-500' size={40} />
            <h2 className='text-gray-500 font-bold text-3xl'>لا توجد تقييمات حاليا   </h2>
        </>
        : type == "products" ? <>
            <BadgeX className='text-gray-500' size={40} />
            <h2 className='text-gray-500 font-bold text-3xl'>لا توجد منتجات حاليا   </h2>
        </>
        : ""
        }

    </div>
    </>
  )
}

export default NotFound