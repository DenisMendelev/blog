import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Input } from "antd";
import { useGetArticleBySlugQuery } from "../../../entities/Post/model/postApi";
import { useUpdateArticleMutation } from "../../../features/EditArticle/model/editArticleApi";
import { useEffect } from "react";
import "./EditArticle.scss";

const { TextArea } = Input;

interface EditArticleFormData {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

interface ServerError {
  status?: number;
  data?: {
    errors?: { [key: string]: string };
  };
}

const EditArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const { data: article, isLoading: isArticleLoading } =
    useGetArticleBySlugQuery(slug || "");
  const [
    updateArticle,
    { isLoading: isUpdating, isSuccess, data: updatedArticle },
  ] = useUpdateArticleMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<EditArticleFormData>({
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: [],
    },
  });

  useEffect(() => {
    if (article && !isArticleLoading) {
      setValue("title", article.title);
      setValue("description", article.description);
      setValue("body", article.body);
      setValue("tagList", article.tagList);
    }
  }, [article, isArticleLoading, setValue]);

  useEffect(() => {
    if (isSuccess && updatedArticle) {
      navigate(`/articles/${updatedArticle.article.slug}`);
    }
  }, [isSuccess, updatedArticle, navigate]);

  const tags = watch("tagList");

  const addTag = () => setValue("tagList", [...tags, ""]);
  const removeTag = (index: number) =>
    setValue(
      "tagList",
      tags.filter((_, i) => i !== index)
    );
  const updateTag = (index: number, value: string) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setValue("tagList", updatedTags);
  };

  const onSubmit = async (data: EditArticleFormData) => {
    try {
      await updateArticle({
        slug: slug!,
        article: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: data.tagList.filter((tag) => tag.trim() !== ""),
        },
        currentPage,
      }).unwrap();
    } catch (err) {
      const serverError = err as ServerError;
      if (serverError.status === 422 && serverError.data?.errors) {
        const serverErrors = serverError.data.errors;
        if (serverErrors.title)
          setError("title", {
            type: "server",
            message: `Title ${serverErrors.title}`,
          });
        if (serverErrors.description)
          setError("description", {
            type: "server",
            message: `Description ${serverErrors.description}`,
          });
        if (serverErrors.body)
          setError("body", {
            type: "server",
            message: `Body ${serverErrors.body}`,
          });
      }
    }
  };

  if (isArticleLoading) return <div>Loading...</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div className="create-article-container">
      <form className="create-article-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit article</h2>
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
        <Button type="primary" htmlType="submit" block disabled={isUpdating}>
          {isUpdating ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default EditArticle;
