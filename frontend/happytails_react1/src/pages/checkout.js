import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
//form state
  const [placed, setPlaced] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  //payment states
  const[paymentMethod, setPaymentMethod] = useState("COD"); 
  const[upiID, setUpiID] = useState("");
  
  //total calculation
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  //discount logic
  const discount = total >1000 ? total * 0.1 : 0;
  const finalAmount = total - discount;

  // SUCCESS SCREEN
  if (placed) {
    return (
      <div
        style={{
          background: "#FFF8F1",
          padding: "100px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#003B2D" }}>🎉 Order Placed Successfully!</h1>
        <p style={{ marginTop: "10px" }}>
          Payment Method: <strong>{paymentMethod}</strong>
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "30px",
            background: "#FF914D",
            color: "#fff",
            padding: "12px 30px",
            borderRadius: "25px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Go to Home
        </button>
      </div>
    );
  }


  // PLACE ORDER FUNCTION
    const handlePlaceOrder = async () => {
      if (!name || !phone || !address) {
      alert("Please fill all billing details");
      return;
    }
    
    //phone validation (+91 & 10 digits)
    const phonePattern = /^\+91\d{10}$/;
    if(!phonePattern.test(phone)) {
      alert("Phone number must start with +91 and contain exactly 10 digits");
      return;
    }

    //upi validation
    if(paymentMethod === "UPI"&& !upiID) {
      alert("Please enter UPI ID");
      return;
    }
    
     // send order to backend
    await fetch("http://localhost:5000/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        address,
        cart,
        total: finalAmount,
        discount,
        paymentMethod,
        upiID,
      }),
    });

    clearCart();
    setPlaced(true);
  };

  return (
    <div
      style={{
        background: "#FFF8F1",
        padding: "70px 80px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "60px",
        minHeight: "70vh",
      }}
    >
      {/* BILLING */}
      <div>
        <h2 style={{ color: "#003B2D", marginBottom: "20px" }}>
          Billing Details
        </h2>

         {/*name*/} 
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        {/*phone*/} 
        <input
          placeholder="Phone Number (+91XXXXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

         {/*address*/} 
        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ ...inputStyle, height: "100px" }}
        />

          {/*payment method*/}    
        <div
          style={{
            margin: "20px 0",
            padding: "15px",
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #eee",
            color: "#003B2D"
          }}
        >
          <strong>Payment Method</strong>
          
           {/*cod*/}
           <div style ={{marginTop: "10px"}}>
            <label> 
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "COD"}
              onChange={()=> setPaymentMethod("COD")}
              />{""} 
              Cash on Delivery(COD)
              </label>
          </div>

           {/*upi*/}

           <div> 
            <input
            type="radio"
            name="payment"
            checked={paymentMethod === "UPI"}
            onChange={() => setPaymentMethod("UPI")}
              />{" "}
              UPI
          </div>


           {/*upi input*/}

            {paymentMethod === "UPI" && (
              <input 
              placeholder="Enter UPI ID"
              value={upiID}
              onChange={(e) => setUpiID(e.target.value)}
              style={{...inputStyle, marginTop: "10px"}}
            />
            )}
            </div>

             {/*place order button*/}
             <button onClick={handlePlaceOrder} style={buttonStyle}>
              Place order
              </button>
              </div>

      {/* SUMMARY */}
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Order Summary</h3>

        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}

        <hr style={{ margin: "20px 0" }} />
        <div style ={{ marginTop: "20px"}}></div>
        <p>Total: ₹{total}</p>
        {discount > 0 && (
          <p style ={{ color : "green"}}>
            Discount (10%): -₹{discount}
          </p> 
        )}
        <h3>Final Amount: ₹{finalAmount}</h3>
      </div>
    </div>
  );
}

//input styling
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "15px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "14px",
};

//button styling
const buttonStyle = {
  marginTop: "10px",
  background: "#003B2D",
  color: "#fff",
  padding: "12px 34px",
  borderRadius: "25px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

export default Checkout;
