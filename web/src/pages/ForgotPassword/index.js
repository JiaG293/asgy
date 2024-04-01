import React, { useState } from "react";
import "./ForgotPassword.scss";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const handleForgotPassword = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/forgot-password",
        {userID: email},
        {
          
        }
      );
  
      if (response.data.status === 200) {
        console.log("Send token to email success");
        console.log("Email: ", response.data.metadata.email);
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Quên mật khẩu?</h2>
      <p>Nhập email của bạn để khôi phục mật khẩu.</p>
      <form>
        <div className="forgot-password-form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={handleForgotPassword} disabled={loading}>
        {loading ? "Đang gửi mail ..." : "Gửi mail"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
