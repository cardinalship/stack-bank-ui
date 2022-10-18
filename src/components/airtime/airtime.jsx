import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AirtimeThunk, selectPreTX, Reset } from "../../redux/auth/TXSlice";
import "./airtime.css";

function Airtime() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    Reset();
  }, []);

  const [airtimeData, setAirtimeData] = useState({ amount: "", phone: "" });

  const checkValue = function (e) {
    e.preventDefault();
    setAirtimeData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const AirtimeTX = useSelector(selectPreTX);

  const AirtimeFUN = function (e) {
    e.preventDefault();
    if (airtimeData.amount && airtimeData.phone) {
      dispatch(AirtimeThunk(airtimeData));
      dispatch(Reset());
    }
  };

  useEffect(() => {
    async function checkAirtime() {
      if (AirtimeTX.status == "Fulfilled") {
        {
          AirtimeTX.data &&
            toast.success(AirtimeTX.data, {
              position: toast.POSITION.TOP_CENTER,
            });
        }
        navigate("/dashbord");
      } else if (AirtimeTX.error) {
        let msg = (await AirtimeTX.error) || "Something went wrong";
        // msg = msg.split(' ').splice(0,11).join(" ")
        {
          AirtimeTX.error &&
            toast.error(msg, { position: toast.POSITION.TOP_CENTER });
        }
      }
      dispatch(Reset());
    }

    checkAirtime();
  }, [AirtimeTX]);

  return (
    <div className="content-airtime">
      <div className="details">
        <h4>Airtime Form</h4>
      </div>
      <form action="">
        <input
          type="number"
          placeholder="Amount"
          onChange={checkValue}
          name="amount"
        />
        <input
          type="number"
          placeholder="Phone Number"
          onChange={checkValue}
          name="phone"
        />
        <button type="button" onClick={AirtimeFUN}>
          Transfer{" "}
        </button>
      </form>
    </div>
  );
}

export default Airtime;
