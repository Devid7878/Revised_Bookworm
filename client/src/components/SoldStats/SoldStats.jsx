import React from 'react'

function SoldStats({ sellerListedProducts }) {

    return (


        <div className='seller-stats-container'>
            {/* Recent Deposits */}
            <p>Quantity Sold:

                {sellerListedProducts.length > 0 && sellerListedProducts?.reduce(
                    (
                        prev,
                        item
                    ) => prev + item.sold,
                    0,
                )}
            </p>
        </div>
    )
}

export default SoldStats
