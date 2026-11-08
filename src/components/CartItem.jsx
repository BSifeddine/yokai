import { Trash } from "lucide-react";

const CartItem = ({ item, index, deleteProduct }) => {
  // Directly grab the image URL passed from the cart item object
  const imageUrl = item.image || (item.images && item.images.length > 0 ? item.images[0] : "");

  return (
    <div className='border border-gray-100 rounded-lg shadow-lg bg-white p-3'>
      <div className='flex gap-3 space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
        
        <div className='shrink-0 flex flex-row justify-center items-center'>
          {imageUrl ? (
            <img 
              className='h-16 w-16 md:h-20 rounded object-cover bg-gray-100' 
              src={imageUrl} 
              alt={item.name} 
            />
          ) : (
            <div className='h-16 w-16 md:h-20 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400'>
              No image
            </div>
          )}
        </div>

        <div className="w-full flex flex-row">
          <div className="w-full flex flex-col items-start justify-start gap-2">
            <div className='w-full min-w-0 flex-1 space-y-4 md:max-w-md'>
              <p className='text-lg font-bold text-gray-900'>
                {item.name}
              </p>
            </div>
            <div className="w-full flex flex-row justify-start gap-2">
              <div className='min-w-0 rounded-lg space-y-4 md:order-2 bg-gray-700 w-11 h-7 flex flex-row justify-center items-center'>
                <p className='text-md font-semibold text-white'>
                  {item.taille}
                </p>
              </div>
              <div className={`min-w-0 rounded-lg space-y-4 md:order-2 border border-gray-700 w-7 h-7 flex flex-row justify-center items-center
                ${item.color == "black" || item.color == "white" ? "bg-" + item.color :
                 item.color == "green" ? "bg-green-700" : item.color == "blue" ? "bg-blue-600" :
                 item.color == "grey" ? "bg-gray-400" :
                 item.color == "rose" ? "bg-rose-950" :
                 item.color == "bleu_nuit" ? "bg-blue-950":
                 item.color == "gray" ? "bg-gray-700" :
                 item.color == "cyan" ? "bg-cyan-300" :
                 item.color == "red" ? "bg-red-600"
                : item.color == "beige" ? "bg-yellow-100" : "bg-" + item.color +"-500"} `}>
              </div>
            </div>
            <div className='flex items-center justify-between md:order-3 md:justify-end'>
              <div className='flex flex-row gap-1'>
                <p className='font-bold text-lg text-red-500'>دج</p>
                <p className='font-bold text-lg text-red-500'>{item.price}</p>
              </div>
            </div>
          </div>
          <div className='w-1/5 flex justify-end'>
            <button
              type="button"
              className='inline-flex items-center text-sm font-medium text-red-400 hover:text-red-500'
              onClick={() => deleteProduct(index)}
            >
              <Trash />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartItem