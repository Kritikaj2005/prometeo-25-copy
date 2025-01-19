import React, { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import "./dashboard.css";
import bg from "../assets/dashboard/dashboard.webp";
// import EventPasses from "./eventPasses";
import useAxios from "../context/UseAxios";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import man from "../assets/dashboard/profileFace.webp";
import girl from "../assets/dashboard/queenBeauty.png";
import EventPasses from "./eventPasses";
import { toPng } from "html-to-image";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Model/modal";
import WorkshopModal from "./Model/WorkshopModel";
import ProniteModal from "./Model/ProniteModel";
import Passes from "../components/passes";

const Dasboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const api = useAxios();
  const [userPassDetails, setUserPassDetails] = useState({});
  const [passCondition, setPassCondition] = useState(false);
  const [userData, setUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const closePass = () => setIsPassOpen(false);
  const [paymentmethod, setpaymentmethod] = useState("Register")

  useEffect(() => {
    window.scrollTo(0, 0);
    const navBarEle = document.getElementById("navbar");
    navBarEle.style.opacity = 1;
    const userDetails = async () => {
      const response = await api.get(`${API_BASE_URL}accounts/userdata/`);
      if (response.status === 200) {
        setUserData(response.data);
        console.log(response.data.pass_type)
        console.log(response.data);
      } else {
        console.log("error");
      }
    };
    userDetails();
  }, []);

  useEffect(() => {
    const userDetails = async () => {
      const response = await api.get(`${API_BASE_URL}accounts/user-passes/`);
      if (response.status === 200) {
        setPassCondition(true);
        setUserPassDetails(response.data);
        console.log(response.data)
      } else if (response.status === 400) {
        setPassCondition(false);
      }
    };
    console.log(userPassDetails);
    userDetails();
  }, []);

  const ref = useRef(null);
  const downloadPng = async () => {
    if (ref.current === null) {
      return;
    }
    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download =
          userData.first_name + "_" + userPassDetails[0].name + ".png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePass = () => {

    // if (passCondition) {
    //   downloadPng();
    // } else {
    //   navigate("/accommodation");
    // }
    toast("Coming Soon, We'll let you know!", {
      type: "info",
      duration: 3000, // Auto-close after 3 seconds
      position: "top-center", // Center the toast on the screen
      hideProgressBar: true,
      closeButton: false,
    });
  };


  const handlePassPending = () => {

    toast("Your transaction is being processed.", {
      type: "info",
      duration: 3000, // Auto-close after 3 seconds
      position: "top-center", // Center the toast on the screen
      hideProgressBar: true,
      closeButton: false,
    });
  };

  const handlePay = (name) => {
    toast.error(`payement for ${name} pass is now closed`);
  }

  const handleOpenModal = () => {
    setIsPassOpen(true);
  };

  return (
    <div className="dashboard__main" style={{ backgroundImage: `url(${bg})` }}>
      <div className="blurLayer_dash"></div>
      <div className="dashboard-title">
        <h1 className="m-0 heading">DASHBOARD</h1>
        <h2 className="m-0 heading">PERSONAL DETAILS</h2>
      </div>
      <div className="dashboard__upper">
        <div>
          <div className="dashboard__profile">
            <img
              className="manProfile"
              src={userData.gender === 'Female' ? girl : man}
            />
            <button
              onClick={() => navigate("/edit-profile")}
              style={{ marginTop: "5px", marginBottom: "5px" }}
            >
              Edit Profile
            </button>
          </div>
          {
            userData.payment_status === "Unpaid" &&
            <div className="open_payment_link_button_group">
              <button onClick={() => handlePay("register")} >Buy Registeration </button>
              <button onClick={() => handlePay("workshop")}>Buy Workshop Stay Pass</button>
              <button onClick={() => handlePay("pronite")}>Buy Pronite Pass</button>
            </div>
          }
          {
            userData.pass_type === "Pronite Pass" && userData.payment_status === "Success" &&
            <div className="open_payment_link_button_group">
              <button onClick={() => handlePay("register")} >Buy Registeration </button>
            </div>
          }
          {
            userData.pass_type === "Workshop Stay Pass" && userData.payment_status === "Success" &&
            <div className="open_payment_link_button_group">
              <button onClick={() => handlePay("pronite")}>Buy Pronite Pass</button>
            </div>
          }

        </div>
        <div className="dashboard__description">
          <div className="user__line">
            <div className="user__left">Full Name</div>
            <div className="user__right">
              {userData.first_name + " " + userData.last_name}
            </div>
          </div>
          <div className="divider"></div>
          <div className="user__line">
            <div className="user__left">Email</div>
            <div className="user__right">{userData.email}</div>
          </div>
          <div className="divider"></div>
          <div className="user__line">
            <div className="user__left">College</div>
            <div className="user__right">{userData.college}</div>
          </div>
          <hr />
          <div className="user__line">
            <div className="user__left">Contact</div>
            <div className="user__right">{userData.contact}</div>
          </div>
          <hr />
          <div className="user__line">
            <div className="user__left">CA</div>
            <div className="user__right">
              {userData.ambassador === true ? "Yes" : "No"}
            </div>
          </div>
          <div className="divider"></div>
          {userData.ambassador === true ? (
            <div className="user__line">
              <div className="user__left">Invite Referral</div>
              <div className="user__right">{userData.invite_referral}</div>
            </div>
          ) : (
            <></>
          )}
          {userData.ambassador === true ? <hr /> : <></>}
          {userData.ambassador === true ? (
            <div className="user__line">
              <div className="user__left">CA Stats</div>
              <div className="user__right">Contact PR after 10 reg </div>
            </div>
          ) : (
            <></>
          )}
          {userData.ambassador === true ? <hr /> : <></>}

          <div className="user__line">
            <div className="user__left">Accommodation Status</div>
            <div className="user__right">
              {userData.pass_type === "0" || userData.pass_type === "None" || userData.pass_type === "Pronite Pass" ? "Update Pass" : "Confirmed"}
            </div>
          </div>
          <div className="divider"></div>

          {userData.coupon_code && (
            <div className="user__line">
              <div className="user__left">Coupon Code</div>
              <div className="user__right">{userData.coupon_code}</div>
            </div>
          )}

          {userData.coupon_code && (
            <div className="divider"></div>
          )}

          <div className="user__line">
            <div className="user__left">Pass Status</div>
            <div className="user__right">
              {userData.pass_type === "0" || userData.pass_type === "None" ? "Purchase Pass" : userData.pass_type}
            </div>
          </div>
          <div className="divider"></div>
        </div>
      </div>
      <div className="dashboard_button">
        {userData.payment_status !== "Unpaid" && (
          <>
            {
              userData.payment_status === "Success" ?
                <button onClick={handleOpenModal} className="passesButton">
                  Download Pass
                </button>
                
                :
                <button className="passesButton _pendding" onClick={handlePassPending} >
                  Download Pass
                </button>
            }
          </>
        )}

        <button onClick={logoutUser} className="loginButtondash">
          Logout
        </button>
      </div>

      {paymentmethod === "register" && (
        <Modal isModalOpen={isModalOpen} closeModal={closeModal} />
      )}
      {paymentmethod === "workshop" && (
        <WorkshopModal isModalOpen={isModalOpen} closeModal={closeModal} />
      )}
      {paymentmethod === "pronite" && (
        <ProniteModal isModalOpen={isModalOpen} closeModal={closeModal} />
      )}

      {/* {(userData.payment_status === "Success") && (
        <button onClick={handleOpenModal} className="passeButton">Download Pass</button>
      )} */}
      <Passes isPassOpen={isPassOpen} closePass={closePass} />
    </div>
  );
};

export default Dasboard;
