import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import { useRegisterUserMutation } from "../../../shared/api/blogApi";
import { setUser } from "../../../features/Auth/model/authSlice";
import "./SignUpForm.scss";

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  agree: boolean;
}

interface ServerError {
  status?: number;
  data?: {
    errors?: {
      [key: string]: string;
    };
  };
}

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      agree: false,
    },
  });

  const password = watch("password");
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setUser(response.user));
      navigate("/articles");
    } catch (err) {
      const serverError = err as ServerError;
      if (serverError.status === 422 && serverError.data?.errors) {
        const serverErrors = serverError.data.errors;
        if (serverErrors.username) {
          setError("username", {
            type: "server",
            message: `Username ${serverErrors.username} can only contain Latin letters and numbers`,
          });
        }
        if (serverErrors.email) {
          setError("email", {
            type: "server",
            message: `Email ${serverErrors.email}`,
          });
        }
        if (serverErrors.password) {
          setError("password", {
            type: "server",
            message: `Password ${serverErrors.password}`,
          });
        }
      }
    }
  };

  return (
    <div className="signup-form-container">
      <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create new account</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 20,
                message: "Username must not exceed 20 characters",
              },
              validate: {
                noSpaces: (value) =>
                  /^\S*$/.test(value) || "Username must not contain spaces",
              },
            })}
          />
          {errors.username && (
            <span className="error">{errors.username.message}</span>
          )}
        </div>
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
              minLength: {
                value: 6,
                message: "Password needs to be at least 6 characters",
              },
              validate: {
                noSpaces: (value) =>
                  /^\S*$/.test(value) || "Password must not contain spaces",
              },
              maxLength: {
                value: 40,
                message: "Password must not exceed 40 characters",
              },
            })}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>Repeat Password</label>
          <input
            type="password"
            placeholder="Repeat Password"
            {...register("repeatPassword", {
              required: "Please repeat your password",
              validate: (value) => value === password || "Passwords must match",
            })}
          />
          {errors.repeatPassword && (
            <span className="error">{errors.repeatPassword.message}</span>
          )}
        </div>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              {...register("agree", {
                required:
                  "You must agree to the processing of personal information",
              })}
            />
            <span className="checkbox-text">
              I agree to the processing of my personal information
            </span>
          </label>
          {errors.agree && (
            <span className="error">{errors.agree.message}</span>
          )}
        </div>
        <Button type="primary" htmlType="submit" block disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
        <p className="signup-link">
          Already have an account? <Link to="/sign-in">Sign In</Link>.
        </p>
      </form>
    </div>
  );
};

export default SignUp;
