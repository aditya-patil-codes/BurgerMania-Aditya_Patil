import React, { useEffect, useState, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
interface BurgerCategory {
  [category: string]: number;
}

interface Burger {
  userId: string;
  burgerId: string;
  burgerName: string;
  burgerCategories: BurgerCategory;
}

const AdminDashboard: React.FC = () => {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [burgerId, setBurgerId] = useState<string>("");
  const [burgerName, setBurgerName] = useState<string>("");
  const [burgerCategories, setBurgerCategories] = useState<BurgerCategory>({
    Veg: 0,
    Egg: 0,
    NonVeg: 0,
  });

  var userId = localStorage.getItem("userId");

  const getBurgersApi = "https://localhost:7126/api/BurgerApi";
  const addBurgerApi = `https://localhost:7126/api/BurgerApi/${userId}`;
  const deleteBurgerApi = "https://localhost:7126/api/BurgerApi";
  const editBurgerApi = `https://localhost:7126/api/BurgerApi/${burgerId}`;

  var navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      toast.error("Login First ");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    fetchBurgers();
  }, []);

  const fetchBurgers = async () => {
    try {
      const response = await fetch(getBurgersApi);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Burger[] = await response.json();
      setBurgers(data);
    } catch (error) {
      console.error("Error fetching burgers:", error);
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (name === "burgerName") {
      setBurgerName(value);
    } else if (name.startsWith("category")) {
      const category = name.split("-")[1];
      setBurgerCategories((prev) => ({
        ...prev,
        [category]: parseInt(value, 10),
      }));
    }
  };

  const handleAddBurger = async (event: React.FormEvent) => {
    event.preventDefault();
    const newBurger = {
      // burgerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Generate or get a unique ID as needed
      burgerName,
      userId: userId as string,
      burgerCategories,
    };

    try {
      const response = await fetch(addBurgerApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBurger),
      });

      if (!response.ok) {
        throw new Error("Failed to add burger");
      }

      alert("Burger added successfully!");
      fetchBurgers(); // Refresh the burger list
      resetForm();
    } catch (error) {
      console.error("Error adding burger:", error);
      alert("Error adding burger");
    }
  };

  const handleDeleteBurger = async (burgerId: string) => {
    try {
      const response = await fetch(`${deleteBurgerApi}/${burgerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete burger");
      }

      alert("Burger deleted successfully!");
      fetchBurgers(); // Refresh the burger list
    } catch (error) {
      console.error("Error deleting burger:", error);
      alert("Error deleting burger");
    }
  };

  const handleEditBurger = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedBurger: Burger = {
      burgerId,
      burgerName,
      userId: userId as string,
      burgerCategories,
    };

    try {
      const response = await fetch(editBurgerApi, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBurger),
      });

      if (!response.ok) {
        throw new Error("Failed to edit burger");
      }

      alert("Burger updated successfully!");
      fetchBurgers(); // Refresh the burger list
      resetForm();
    } catch (error) {
      console.error("Error editing burger:", error);
      alert("Error editing burger");
    }
  };

  const resetForm = () => {
    setBurgerId("");
    setBurgerName("");
    setBurgerCategories({ Veg: 0, Egg: 0, NonVeg: 0 });
  };

  return (
    <div style={{ backgroundColor: "#0F1A27" }} className=" py-5">
      <h1 className="text-center mb-4 text-white">Admin Dashboard</h1>

      <div className="container">
        <h2 className="mb-3 text-white">Add New Burger</h2>
        <form onSubmit={handleAddBurger}>
          <div className="mb-3">
            <label htmlFor="burgerName" className="form-label text-white">
              Burger Name:
            </label>
            <input
              type="text"
              id="burgerName"
              name="burgerName"
              className="form-control"
              value={burgerName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 text-white">
            <label className="form-label">Categories:</label>
            <div className="row">
              <div className="col">
                <label htmlFor="category-Veg">Veg Price:</label>
                <input
                  type="number"
                  id="category-Veg"
                  name="category-Veg"
                  className="form-control"
                  value={burgerCategories.Veg}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="category-Egg">Egg Price:</label>
                <input
                  type="number"
                  id="category-Egg"
                  name="category-Egg"
                  className="form-control"
                  value={burgerCategories.Egg}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="category-NonVeg">Non-Veg Price:</label>
                <input
                  type="number"
                  id="category-NonVeg"
                  name="category-NonVeg"
                  className="form-control"
                  value={burgerCategories.NonVeg}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Add Burger
          </button>
        </form>

        <h2 className="mt-5 mb-3 text-white">Existing Burgers</h2>
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Burger Name</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {burgers.map((burger) => (
              <tr key={burger.burgerId}>
                <td className="align-middle">{burger.burgerName}</td>
                <td className="align-middle">
                  {Object.entries(burger.burgerCategories).map(
                    ([category, price]) => (
                      <div key={category}>
                        {category}: Rs. {price}
                      </div>
                    )
                  )}
                </td>
                <td>
                  <div className="d-flex gap-3">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteBurger(burger.burgerId)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setBurgerId(burger.burgerId);
                        setBurgerName(burger.burgerName);
                        setBurgerCategories(burger.burgerCategories);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {burgerId && (
          <div className="mt-5 text-white">
            <h2>Edit Burger</h2>
            <form onSubmit={handleEditBurger}>
              <div className="mb-3">
                <label htmlFor="editBurgerName" className="form-label">
                  Burger Name:
                </label>
                <input
                  type="text"
                  id="burgerName"
                  name="burgerName"
                  className="form-control"
                  value={burgerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Categories:</label>
                <div className="row">
                  <div className="col">
                    <label htmlFor="editCategory-Veg">Veg Price:</label>
                    <input
                      type="number"
                      id="editCategory-Veg"
                      name="category-Veg"
                      className="form-control"
                      value={burgerCategories.Veg}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="editCategory-Egg">Egg Price:</label>
                    <input
                      type="number"
                      id="editCategory-Egg"
                      name="category-Egg"
                      className="form-control"
                      value={burgerCategories.Egg}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="editCategory-NonVeg">Non-Veg Price:</label>
                    <input
                      type="number"
                      id="editCategory-NonVeg"
                      name="category-NonVeg"
                      className="form-control"
                      value={burgerCategories.NonVeg}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-warning">
                Update Burger
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
