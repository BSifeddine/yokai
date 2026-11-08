import React from 'react'
import OrderItem from './OrderItem'

function Confirmes({orders, refresh}) {
  return (
    <div className="bg-white md:rounded-lg md:shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="w-12 px-2 py-2 border">#</th>
              <th className="w-40 px-2 py-2 border">Nom</th>
              <th className="w-40 px-2 py-2 border">Produit</th>
              <th className="w-32 px-2 py-2 border">Numéro</th>
              <th className="w-52 px-2 py-2 border">Adresse</th>
              <th className="w-28 px-2 py-2 border">Prix total</th>
			  <th className="w-28 px-2 py-2 border">Type</th>
              <th className="w-28 px-2 py-2 border">État</th>
            </tr>
          </thead>
		  	<tbody className='bg-white divide-y divide-gray-50'>
				{orders?.map((order, index) => (
					<OrderItem order = {order} refresh={refresh} index={index} total={orders?.length}/>
				))}
				</tbody>
        </table>
      </div>
    </div>
  );
}

export default Confirmes