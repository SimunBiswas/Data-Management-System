import { useState } from "react";
import { generateOTP, validateOTP } from "../api/api";

function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: enter mobile, 2: enter OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Send OTP
  const handleGenerateOTP = async () => {
    if (!mobile) return setError("Please enter a mobile number");
    setLoading(true);
    setError("");
    try {
      const res = await generateOTP(mobile);

      if (res.status) {
          setStep(2);
          alert("OTP sent successfully!");
          console.log("Generate OTP response:", res.data);
      } else {
        setError(res.data.data || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while sending OTP");
    }
    setLoading(false);
  };

  // Step 2: Validate OTP
  const handleValidateOTP = async () => {
    if (!otp) return setError("Please enter OTP");
    setLoading(true);
    setError("");
    try {
      const res = await validateOTP(mobile, otp);
      console.log("Validate OTP response:", res.data);

      if (res.status) {
        localStorage.setItem("token", res.data.token);
        alert("Login Successful!");
      } else {
        setError(res.data.data || "Invalid OTP or mobile number not registered");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while validating OTP");
    }
    const savedToken = localStorage.getItem("token");
    console.log("Saved token:", savedToken);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login via OTP</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {step === 1 ? (
        <>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button onClick={handleGenerateOTP} disabled={loading} style={{ width: "100%", padding: "10px" }}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button onClick={handleValidateOTP} disabled={loading} style={{ width: "100%", padding: "10px" }}>
            {loading ? "Validating OTP..." : "Validate OTP"}
          </button>
        </>
      )}
    </div>
  );
}

export default Login;
