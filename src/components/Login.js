import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { generateOTP, validateOTP } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";

function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: enter mobile, 2: enter OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleValidateOTP = async () => {
    if (!otp) return setError("Please enter OTP");
    setLoading(true);
    setError("");
    try {
      const res = await validateOTP(mobile, otp);
      console.log("Validate OTP response:", res);

      if (res.status) {
        const { token, user_id, user_name } = res.data;

        saveToken(token, { user_id, user_name });

        alert("Login Successful!");
        navigate("/upload");
      } else {
        setError(res.data.data || "Invalid OTP or mobile number not registered");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while validating OTP");
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#475586" }}
    >
      <Card style={{ width: "350px" }}>
        <Card.Body className="shadow-lg">

          <h3 className="text-center rounded p-3 fw-bolder" 
          style={{ color: "#202B51" }}
          >
            LOGIN
          </h3>
          <img src="./DocumentManagement.png" alt="img" style={{"width" : "300px"}} />
          <h2 style={{"color" : "#202B51 !important"}} className="text-primary-emphasis fs-4 text-center fw-bold p-4">Document <br /> Management System</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {step === 1 ? (
            <>
              <Form.Group className="mb-3">
                <label className="ms-1">Enter Mobile Number</label>
                <Form.Control
                  type="text"
                  placeholder="99XXXXXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="mt-1"
                />
              </Form.Group>
              <p className="text-secondary text-opacity-50 text-center">We will send you one time <br /> password(OTP).</p>

              <Button
                variant="primary rounded-lg"
                onClick={handleGenerateOTP}
                disabled={loading}
                className="w-100"
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Send"}
              </Button>
            </>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="success"
                onClick={handleValidateOTP}
                disabled={loading}
                className="w-100"
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Verify"}
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
