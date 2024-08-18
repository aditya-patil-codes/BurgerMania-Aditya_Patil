import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import burgerImage from "../images/file.png"; // Adjust the path as needed
import "../css/home.css";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {

  var navigate = useNavigate() ; 

  const loginAction = ()=>{
    navigate("/login")
  }
  const registerAction = ()=>{
    navigate("/register")

  }

  return (
    <div
      style={{
        overflow: "hidden",
        backgroundColor: "#0F1A27",
        height: "100vh",
      }}
    >
      <h1 className=" pt-4 position-absolute ms-5 text-white">Burger Mania</h1>
      <div>
        <div className="row ms-5">
          <div
            className="col px-0"
            style={{ marginTop: "180px" }}
          >
            <div className="main-heading display-1 fw-bold ">
              Ready For a <span className="juicy">JUICY</span> One ?
            </div>

            <div className=" d-flex gap-4 mt-5">
              <button className="home-btn lbtn" type="button"  onClick={loginAction} >Login</button>
              <button className="home-btn rbtn" type="button" onClick={registerAction}>Register</button>
            </div>
          </div>
          <div className="col ">
            <div style={{ marginLeft: "60px" }}>
              <img
                className=""
                style={{
                  height: "auto",
                  width: "350px",
                  marginTop: "-10px",
                  transform: "rotate(15deg)",
                }}
                src={burgerImage}
                alt="Burger"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
