import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const Checkout: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [discountedPrice, setDiscountedPrice] = useState<number>(0);
    const [discount, setDiscount] = useState<string>('0%');

    const userId = localStorage.getItem('userId');

    const getCartApi = "https://localhost:7126/api/CartApi";
    const deleteCartProductApi = "https://localhost:7126/api/CartApi";
    const placeOrderApi = 'https://localhost:7126/api/OrderApi';

    useEffect(() => {
        if (!userId) {
            alert('Please log in first to access this page.');
            window.location.href = './index.html';
        } else {
            fetchCartProducts();
        }
    }, [userId]);

    const fetchCartProducts = async () => {
        try {
            const response = await fetch(`${getCartApi}/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const items = await response.json();
            setCartItems(items);
            calculateTotals(items);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const calculateTotals = (items: any[]) => {
        let quantity = 0;
        let price = 0;

        items.forEach(product => {
            quantity += product.quantity;
            price += product.price * product.quantity;
        });

        setTotalQuantity(quantity);
        setTotalPrice(price);
        updateDiscount(price);
    };

    const updateDiscount = (price: number) => {
        let discountValue = 0;
        if (price >= 500 && price < 1000) {
            discountValue = 5;
        } else if (price >= 1000) {
            discountValue = 10;
        }
        setDiscount(`${discountValue}%`);
        setDiscountedPrice(price - (price * (discountValue / 100)));
    };

    const removeFromCart = async (burgerId: string, burgerCategory: string) => {
        try {
            const response = await fetch(`${deleteCartProductApi}/${userId}/${burgerId}/${burgerCategory}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            fetchCartProducts();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const placeOrder = async () => {
        if (totalPrice === 0) {
            alert('You do not have any items to proceed :)');
            return;
        }

        try {
            const response = await fetch(`${placeOrderApi}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to place order: ${errorMessage}`);
            }

            alert('Order placed successfully!');
            fetchCartProducts();
        } catch (error) {
            console.error('Error placing order:', error);
            alert(`Error placing order`);
        }
    };

    return (
        <div className=" py-5" style={{backgroundColor:"#0F1A27"}} >
            <div className='container text-white'>
            <h1 className="text-center mb-4">Cart</h1>
            <div className="cart-container">
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>Burger Type</th>
                            <th>Burger Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(product => (
                            <tr key={product.burgerId}>
                                <td>{product.burgerName}</td>
                                <td>{product.burgerCategory}</td>
                                <td>{product.price.toFixed(2)}</td>
                                <td>{product.quantity}</td>
                                <td>{(product.price * product.quantity).toFixed(2)}</td>
                                <td>
                                    <button className="btn  btn-sm" onClick={() => removeFromCart(product.burgerId, product.burgerCategory)}>❌</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="checkout-container row">
                <div className="col-md-6 b">
                    <div className="card bg-dark text-white">
                        <div className="card-body">
                            <h5 className="card-title">Order Summary</h5>
                            <p className="card-text">Total Quantity: {totalQuantity}</p>
                            <p className="card-text">Total Price: {totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card bg-dark text-white">
                        <div className="card-body">
                            <h5 className="card-title">Discount</h5>
                            <p className="card-text">Discount: {discount}</p>
                            <p className="card-text">Final Price: {discountedPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-4">
                <button className="btn btn-success" onClick={placeOrder}>Place Order</button>
            </div>
            </div>
        </div>
    );
};

export default Checkout;