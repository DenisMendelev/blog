import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../../../shared/api/blogApi";
import { setUser } from "../../../features/Auth/model/authSlice";
import "./SignInForm.scss";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setUser(response.user));
      navigate("/articles");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="signin-form-container">
      <form className="signin-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign In</h2>
        {error && <div className="error">Login failed: {error.toString()}</div>}
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            placeholder="Email address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
              validate: {
                noSpaces: (value) =>
                  /^\S*$/.test(value) || "Email must not contain spaces",
              },
            })}
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>
        <Button type="primary" htmlType="submit" block disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
        <p className="signup-link">
          Don’t have an account? <Link to="/sign-up">Sign Up</Link>.
        </p>
      </form>
    </div>
  );
};

export default SignIn;
