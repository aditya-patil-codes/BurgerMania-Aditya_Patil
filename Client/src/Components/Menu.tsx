import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";

// Define the structure of a burger
interface BurgerCategory {
  [category: string]: number;
}

interface Burger {
  burgerId: string;
  burgerName: string;
  burgerCategories: BurgerCategory;
}

// Define the props for the Burger component
interface BurgerProps {
  burger: Burger;
  onAddToCart: (
    burgerId: string,
    burgerName: string,
    category: string,
    quantity: number
  ) => void;
}

// Burger component
const Burger: React.FC<BurgerProps> = ({ burger, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  const handleAddToCart = () => {
    if (!selectedCategory) {
      alert("Please select a category before adding to cart.");
      return;
    }
    onAddToCart(burger.burgerId, burger.burgerName, selectedCategory, quantity);
  };

  const categoryOptions = Object.entries(burger.burgerCategories).map(
    ([category, price]) => (
      <option key={category} value={category}>
        {category} - Rs. {price}
      </option>
    )
  );

  return (
    <div className="card mb-4" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{burger.burgerName}</h5>
        <div className="form-group">
          <label htmlFor={`category-${burger.burgerId}`}>Category:</label>
          <select
            id={`category-${burger.burgerId}`}
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="" disabled>
              Select a category
            </option>{" "}
            {/* Default disabled option */}
            {categoryOptions}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`quantity-${burger.burgerId}`}>Quantity:</label>
          <input
            type="number"
            id={`quantity-${burger.burgerId}`}
            className="form-control"
            min="1"
            max="5"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// Main BurgersPage component
const BurgersPage: React.FC = () => {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
        toast.error("Login First ")
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const response = await fetch("https://localhost:7126/api/BurgerApi");
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data: Burger[] = await response.json();
        setBurgers(data);
      } catch (error) {
        console.error("Error fetching burgers:", error);
      }
    };

    fetchBurgers();
  }, [navigate]);

  const handleAddToCart = async (
    burgerId: string,
    burgerName: string,
    category: string,
    quantity: number
  ) => {
    if (quantity > 5) {
      alert("Sorry, you cannot buy more than 5 burgers!");
      return;
    }

    const burger = burgers.find((b) => b.burgerId === burgerId);
    if (!burger) {
      alert("Burger not found");
      return;
    }
    const price = burger.burgerCategories[category];

    const burgerItem = {
      burgerId,
      burgerName,
      burgerCategory: category,
      quantity,
      price,
      userId,
    };

    try {
      const response = await fetch(
        `https://localhost:7126/api/CartApi/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(burgerItem),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add burger to cart");
      }
      alert(`Added ${quantity} ${category} ${burgerName} to cart`);
    } catch (error) {
      console.error("There was a problem with the POST operation:", error);
    }
  };

  const handleCheckout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    alert("Redirecting to the checkout page...");
    navigate("/checkout"); // Redirect to checkout page
  };

  return (
    <div style={{
      backgroundColor:"#0F1A27",
      height:"115vh"
    }}>
      <div className="container">
      <h1 className="text-center py-4 text-white">Burgers</h1>
      <div className="row">
        {burgers.map((burger) => (
          <div className="col-md-4" key={burger.burgerId}>
            <Burger burger={burger} onAddToCart={handleAddToCart} />
          </div>
        ))}
      </div>
      <div className="text-center my-4">
        <button
          type="button"
          className="btn btn-success"
          id="add-to-cart-button"
          onClick={handleCheckout}
        >
          Proceed To Checkout
        </button>
      </div>
      <ToastContainer/>
    </div>
      </div>
  );
};

export default BurgersPage;
