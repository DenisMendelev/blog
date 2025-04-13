import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../shared/store/store";
import { setUser } from "../../../features/Auth/model/authSlice";
import { useUpdateUserMutation } from "../../../features/Auth/model/authApi";
import "./EditProfile.scss";

interface EditProfileFormData {
  username: string;
  email: string;
  password?: string;
  image?: string;
}

interface ServerError {
  status?: number;
  data?: {
    errors?: {
      [key: string]: string;
    };
  };
}

const EditProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<EditProfileFormData>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      image: user?.image || "",
    },
  });

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      const response = await updateUser({
        username: data.username,
        email: data.email,
        password: data.password || undefined,
        image: data.image || undefined,
      }).unwrap();

      const updatedUser = {
        ...response.user,
        image: response.user.image || data.image || "",
      };

      dispatch(setUser(updatedUser));
      navigate("/articles");
    } catch (err) {
      const serverError = err as ServerError;
      if (serverError.status === 422 && serverError.data?.errors) {
        const serverErrors = serverError.data.errors;
        if (serverErrors.username) {
          setError("username", {
            type: "server",
            message: `Username ${serverErrors.username}`,
          });
        }
        if (serverErrors.email) {
          setError("email", {
            type: "server",
            message: `Email ${serverErrors.email}`,
          });
        }
      }
    }
  };

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit profile</h2>
        <div className="form-group">
          <label>
            Username <span className="required">*</span>
          </label>
          <Controller
            name="username"
            control={control}
            rules={{
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
            }}
            render={({ field }) => <Input placeholder="Username" {...field} />}
          />
          {errors.username && (
            <span className="error">{errors.username.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>
            Email address <span className="required">*</span>
          </label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
              validate: {
                noSpaces: (value) =>
                  /^\S*$/.test(value) || "Email must not contain spaces",
              },
            }}
            render={({ field }) => (
              <Input placeholder="Email address" {...field} />
            )}
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>New password</label>
          <Controller
            name="password"
            control={control}
            rules={{
              minLength: {
                value: 6,
                message: "Password needs to be at least 6 characters",
              },
              maxLength: {
                value: 40,
                message: "Password must not exceed 40 characters",
              },
              validate: {
                noSpaces: (value) =>
                  value === undefined ||
                  value === "" ||
                  (/^\S*$/.test(value) && value !== undefined) ||
                  "Password must not contain spaces",
              },
            }}
            render={({ field }) => (
              <Input.Password placeholder="New password" {...field} />
            )}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>Avatar (url)</label>
          <Controller
            name="image"
            control={control}
            rules={{
              pattern: {
                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i,
                message: "Please enter a valid URL",
              },
            }}
            render={({ field }) => (
              <Input placeholder="Avatar image" {...field} />
            )}
          />
          {errors.image && (
            <span className="error">{errors.image.message}</span>
          )}
        </div>
        <Button type="primary" htmlType="submit" block disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;
