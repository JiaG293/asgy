import React, { useState } from "react";
import "./ForgotPassword.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/forgot-password",
        { userID: email },
        {}
      );

      if (response.data.status === 200) {
        console.log("Send token to email success");
        console.log("Email: ", response.data.metadata.email);
        toast.success("Đã gửi email");
        setEmail("");
      }
    } catch (error) {
      toast.error("Gửi mail thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="forgot-password-container">
        <h2>Quên mật khẩu?</h2>
        <p>Nhập email của bạn để khôi phục mật khẩu.</p>
        <form>
          <div className="forgot-password-form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? "Đang gửi mail ..." : "Gửi mail"}
          </button>
        </form>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default ForgotPassword;
