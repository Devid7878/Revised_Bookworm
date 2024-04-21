import { GlobalState } from '../../globalState/GlobalState';
import { useContext, useEffect, useState } from 'react';
// import CreateProduct from './createProduct/createProduct';
import Category from './Category/Category';
import SellerProductsList from './SellerProductsList';
import Order from './Order';
import Header from '../Header/Header';
import './Seller.css';
import SoldStats from '../SoldStats/SoldStats';
import axios from 'axios';

function Seller() {
	const state = useContext(GlobalState);
	const history = state?.userAPI.history;
	const [sellerListedProducts, setSellerListedProducts] = useState([]);

	useEffect(() => {
		const getSellerListedProducts = async () => {
			const res = await axios.get(
				'http://localhost:5000/api/seller-listed-products',
				{
					headers: {
						Authorization: localStorage.getItem('token'),
					},
				},
			);

			setSellerListedProducts(res.data.products);
		};
		getSellerListedProducts();
	}, [setSellerListedProducts]);

	return (
		<div className='seller-main-container'>
			<Header />
			<div className='seller-inner-container'>
				{/* Recent Deposits */}
				<div className='seller-sold-stats'>
					<div className='stats'>
						<p>
							Total Revenue: &#x20B9;{' '}
							{history?.reduce(
								(prev, item: { cart: [] }) =>
									prev +
									item.cart.reduce(
										(prevItem, product: { quantity: number; price: number }) =>
											prevItem + product.quantity * product.price,
										0,
									),
								0,
							)}
						</p>
						<SoldStats sellerListedProducts={sellerListedProducts} />
					</div>
				</div>

				{/* <Orders /> */}

				<div className='orders-container'>
					<h1>Orders</h1>
					<Order />
				</div>

				{/* category */}

				<div className='category-container'>
					<h1>Category</h1>
					<Category />
				</div>

				{/* product list */}
				<SellerProductsList
					sellerListedProducts={sellerListedProducts}
					setSellerListedProducts={setSellerListedProducts}
				/>
			</div>
		</div>
	);
}

export default function Dashboard() {
	return <Seller />;
}
