import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import { useCreateArticleMutation } from "../../../features/CreateArticle/model/createArticleApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../shared/store/store";
import "./CreateArticle.scss";

const { TextArea } = Input;

interface CreateArticleFormData {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

interface ServerError {
  status?: number;
  data?: {
    errors?: {
      [key: string]: string;
    };
  };
}

const CreateArticle = () => {
  const navigate = useNavigate();
  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<CreateArticleFormData>({
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: [],
    },
  });

  const tags = watch("tagList");

  const addTag = () => {
    setValue("tagList", [...tags, ""]);
  };

  const removeTag = (index: number) => {
    setValue(
      "tagList",
      tags.filter((_, i) => i !== index)
    );
  };

  const updateTag = (index: number, value: string) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setValue("tagList", updatedTags);
  };

  const onSubmit = async (data: CreateArticleFormData) => {
    try {
      const response = await createArticle({
        article: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: data.tagList.filter((tag) => tag.trim() !== ""),
        },
      }).unwrap();
      navigate(`/articles/${response.article.slug}`, { replace: true });
    } catch (err) {
      const serverError = err as ServerError;
      if (serverError.status === 422 && serverError.data?.errors) {
        const serverErrors = serverError.data.errors;
        if (serverErrors.title) {
          setError("title", {
            type: "server",
            message: `Title ${serverErrors.title}`,
          });
        }
        if (serverErrors.description) {
          setError("description", {
            type: "server",
            message: `Description ${serverErrors.description}`,
          });
        }
        if (serverErrors.body) {
          setError("body", {
            type: "server",
            message: `Body ${serverErrors.body}`,
          });
        }
      }
    }
  };

  if (!user) {
    navigate("/sign-in");
    return null;
  }

  return (
    <div className="create-article-container">
      <form className="create-article-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create new article</h2>
        <div className="form-group">
          <label>
            Title <span className="required">*</span>
          </label>
          <Controller
            name="title"
            control={control}
            rules={{
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            }}
            render={({ field }) => <Input placeholder="Title" {...field} />}
          />
          {errors.title && (
            <span className="error">{errors.title.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>
            Short description <span className="required">*</span>
          </label>
          <Controller
            name="description"
            control={control}
            rules={{
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            }}
            render={({ field }) => (
              <Input placeholder="Short description" {...field} />
            )}
          />
          {errors.description && (
            <span className="error">{errors.description.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>
            Text <span className="required">*</span>
          </label>
          <Controller
            name="body"
            control={control}
            rules={{
              required: "Text is required",
              minLength: {
                value: 5,
                message: "Text must be at least 5 characters",
              },
            }}
            render={({ field }) => (
              <TextArea rows={8} placeholder="Text" {...field} />
            )}
          />
          {errors.body && <span className="error">{errors.body.message}</span>}
        </div>
        <div className="form-group">
          <label>Tags</label>
          {tags.map((tag, index) => (
            <div key={index} className="tag-input-group">
              <Input
                placeholder="Tag"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                style={{ width: "200px", marginRight: "10px" }}
              />
              <Button danger onClick={() => removeTag(index)}>
                Delete
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={addTag} style={{ marginTop: "10px" }}>
            Add tag
          </Button>
        </div>
        <Button type="primary" htmlType="submit" block disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default CreateArticle;
