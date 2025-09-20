/**
 * Custom form validation hook for authentication forms
 *
 * This hook provides form validation functionality for login, registration,
 * and other authentication-related forms.
 */

import { useState, useEffect } from "react";

/**
 * Form validation hook for authentication forms
 *
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFn - Validation function
 * @param {Function} onSubmit - Form submission handler
 * @returns {Object} Form state and handlers
 */
const useAuthForm = (initialValues, validateFn, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  // Reset submission error when values change
  useEffect(() => {
    if (submissionError && Object.keys(touched).length > 0) {
      setSubmissionError(null);
    }
  }, [values, submissionError, touched]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });

    // Clear field-specific error when changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle input blur (mark field as touched)
  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate the field on blur
    const fieldErrors = validateFn({
      ...values,
      [name]: values[name],
    });

    setErrors({
      ...errors,
      ...fieldErrors,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setTouched(allTouched);

    // Validate all fields
    const formErrors = validateFn(values);
    setErrors(formErrors);

    // Check if there are any errors
    const hasErrors = Object.keys(formErrors).some((key) => formErrors[key]);

    if (!hasErrors) {
      setIsSubmitting(true);
      setSubmissionError(null);

      try {
        await onSubmit(values);
      } catch (error) {
        setSubmissionError(error.message || "An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmissionError(null);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submissionError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  };
};

/**
 * Validate login form
 * @param {Object} values - Form values
 * @returns {Object} Validation errors
 */
export const validateLoginForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
};

/**
 * Validate registration form
 * @param {Object} values - Form values
 * @returns {Object} Validation errors
 */
export const validateRegistrationForm = (values) => {
  const errors = {};

  if (!values.displayName) {
    errors.displayName = "Name is required";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
    errors.password =
      "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

/**
 * Validate password reset request form
 * @param {Object} values - Form values
 * @returns {Object} Validation errors
 */
export const validatePasswordResetForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }

  return errors;
};

/**
 * Validate new password form
 * @param {Object} values - Form values
 * @returns {Object} Validation errors
 */
export const validateNewPasswordForm = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
    errors.password =
      "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

export default useAuthForm;
