import React, { useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const LoginUser = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event, key) => {
    const value = event.target.value;
    setData({ ...data, [key]: value });
  };

  const submitDetails = (event) => {
    event.preventDefault();

    if (
      data.email.trim() === "" ||
      data.password.trim() === ""
    ) {
      toast.warn(`Fields can't be blank or contain only spaces`, {
        position: "top-center",
        autoClose: 1500,
        theme: "dark",
      });
      return;
    }

    toast.success("Logged in (UI Only)", {
      position: "top-center",
      autoClose: 1500,
      theme: "colored",
    });
  };

  return (
    <>
      <MDBContainer fluid className="p-3 my-5 h-custom">
        <MDBRow className="d-flex align-items-center">
          <MDBCol col="10" md="6">
            <h1 className="mx-5">Welcome</h1>
            <span className="mx-5 mb-4 d-block">
              Vehicle Management System
            </span>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Login Illustration"
            />
          </MDBCol>

          <MDBCol col="4" md="6">
            <form onSubmit={submitDetails}>
              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="email"
                type="email"
                onChange={(e) => handleChange(e, "email")}
                value={data.email}
                size="lg"
              />

              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="password"
                type="password"
                onChange={(e) => handleChange(e, "password")}
                value={data.password}
                size="lg"
              />

              <div className="d-flex justify-content-between mb-4">
                <MDBCheckbox
                  name="rememberMe"
                  id="rememberMe"
                  label="Remember me"
                />
                <Link to="#">Forgot password?</Link>
              </div>

              <div className="text-center text-md-start mt-4 pt-2">
                <MDBBtn type="submit" className="mb-0 px-5" size="lg">
                  Login
                </MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <ToastContainer />
    </>
  );
};

export default LoginUser;
