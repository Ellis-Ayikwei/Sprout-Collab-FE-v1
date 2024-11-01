import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import DotLoader from "components/DotLoader";
import React from "react";
import authAxiosInstance from "../../helpers/authAxiosInstance";
import logo from "../../images/sclogo-alone.png";
import { SetloginData } from "../../redux/authActions/LoginSlice";

const ResetPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const resetPasswordHandler = async (event) => {
		event.preventDefault();
		setError("");
		setSuccess(false);

		if (!email) {
			setError("Please enter your email address.");
			return;
		}

		try {
			setLoading(true);
			const response = await authAxiosInstance.post("/recover", { email });
			if (response.status === 200) {
				setSuccess(true);
				setTimeout(() => navigate("/login"), 3000);
			}
		} catch (error) {
			setError("Failed to reset password. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-screen flex items-center justify-center">
			<main className="flex flex-col items-center w-full mx-auto">
				<Link to="/" className="flex items-center text-3xl mb-8">
					<img className="w-14 h-14" src={logo} alt="Logo" />
					<p className="logo-text">
						<b>Sprout</b>Collab
					</p>
				</Link>
				<div className="w-full max-w-md rounded-2xl border-2 border-main shadow p-10 items-center">
					<h3 className="text-2xl font-semibold pt-2 mb-4">Reset Password</h3>
					{error && (
						<div className="w-full text-red-500 border-2 border-red-400 p-4 rounded-full">
							{error}
						</div>
					)}
					{success && (
						<div className="w-full text-green-500 border-2 border-green-400 p-4 rounded-full">
							Password reset link sent! Redirecting to login...
						</div>
					)}
					<form className="flex flex-col" onSubmit={resetPasswordHandler}>
						<input
							type="email"
							className="p-2 rounded-2xl lg:-full md:w-full border-[1px] focus:border-[3px] border-green-400 m-1 focus:shadow-md focus:border-green-500 focus:outline-none focus:ring-0"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="on"
						></input>
						<button
							type="submit"
							className="flex gap-2 rounded-full m-2 font-semibold px-2 py-2 shadow-md justify-center items-center btn text-white bg-main hover:text-blue-400 hover:bg-white transition duration-200 ease-in"
						>
							{loading ? <DotLoader width="w-7" height="h-7" /> : "Send Reset Link"}
						</button>
					</form>
					<div className="flex flex-row items-center justify-center text-center !gab-6">
						<p className="text-sm">Remembered your password?</p>
						<Link to="/login" className="text-blue-400 ml-1 text-sm font-medium cursor-pointer">
							Sign In
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ResetPassword;

