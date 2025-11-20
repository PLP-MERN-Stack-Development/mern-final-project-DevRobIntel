import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import {
  Form,
  Button,
  FloatingLabel,
  DropdownButton,
  Dropdown,
  Spinner,
  FormText
} from 'react-bootstrap';
import { Save } from 'react-bootstrap-icons';

// Validation schema
const schema = yup.object({
  title: yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  content: yup.string()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters'),
  category: yup.string().required('Category is required'),
});

const PostForm = ({ 
  onSubmit, 
  defaultValues = {}, 
  categories = [], 
  loading = false, 
  isEditMode = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,  // Auto populates form
    mode: 'onChange',
  });

  // Watch form values for dropdown display
  const title = watch('title');
  const selectedCategory = watch('category');

  // Set default category on mount (for edit mode)
  useEffect(() => {
    if (defaultValues.category && categories.length > 0) {
      setValue('category', defaultValues.category);
    }
  }, [defaultValues.category, categories.length, setValue]);

  const handleCategorySelect = (categoryId) => {
    setValue('category', categoryId);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Title - Auto populated */}
      <FloatingLabel label="Post Title" className="mb-4">
        <Form.Control
          type="text"
          placeholder="Enter a compelling title..."
          {...register('title')}
          isInvalid={!!errors.title}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title?.message}
        </Form.Control.Feedback>
        {isEditMode && title && (
          <FormText className="text-muted">
            Editing: "{title}"
          </FormText>
        )}
      </FloatingLabel>

      {/* Category Dropdown - Auto selected */}
      <div className="mb-4">
        <DropdownButton
          title={
            selectedCategory
              ? categories.find(c => c._id === selectedCategory)?.name || "Select Category"
              : "Select Category"
          }
          variant="outline-primary"
          className="w-100 text-start"
          disabled={loading || categories.length === 0}
        >
          {categories.length === 0 ? (
            <Dropdown.Item disabled>
              No categories available
            </Dropdown.Item>
          ) : (
            categories.map((category) => (
              <Dropdown.Item
                key={category._id}
                active={selectedCategory === category._id}
                onClick={() => handleCategorySelect(category._id)}
              >
                {category.name}
              </Dropdown.Item>
            ))
          )}
        </DropdownButton>
        
        {errors.category && (
          <FormText className="text-danger d-block mt-1">
            {errors.category.message}
          </FormText>
        )}
      </div>

      {/* Content - Auto populated */}
      <FloatingLabel label="Post Content" className="mb-4">
        <Form.Control
          as="textarea"
          rows={12}
          placeholder="Write your post content here..."
          {...register('content')}
          isInvalid={!!errors.content}
          disabled={loading}
          style={{ resize: 'vertical', minHeight: '300px' }}
        />
        <Form.Control.Feedback type="invalid">
          {errors.content?.message}
        </Form.Control.Feedback>
        {isEditMode && watch('content') && (
          <FormText className="text-muted">
            Edit your content above
          </FormText>
        )}
      </FloatingLabel>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-100 py-3 fs-5 fw-bold"
        disabled={!isValid || loading || categories.length === 0}
      >
        {loading ? (
          <>
            <Spinner size="sm" className="me-2" />
            {isEditMode ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>
            <Save className="me-2" />
            {isEditMode ? 'Update Post' : 'Create Post'}
          </>
        )}
      </Button>
    </Form>
  );
};

export default PostForm;