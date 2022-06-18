import React, { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
import { login } from "../api/auth";
import { useMyUpdateContext } from "../AppProvider";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const handleStateUpdate = useMyUpdateContext();

  const [showPassword, setShowPassword] = useState(false);

  const ValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("invalid email address")
      .required("Email is required"),
  });

  const handleForgotPassword = async (payload) => {
    const res = await login(payload);
    console.log("Res: ", res);
    if (!res.data) setIsSubmitting(false);
    handleStateUpdate({ authenticated: true });
    handleStateUpdate({ userProfile: res.data });
    navigate(from, { replace: true });
  }
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      handleForgotPassword(values);
    },
  });

  const { errors, touched, values, isSubmitting, setIsSubmitting, handleSubmit, getFieldProps } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }} initial={{ opacity: 0, y: 40 }}>
            <TextField fullWidth autoComplete="username" type="email" label="Email Address"
              {...getFieldProps("email")} error={Boolean(touched.email && errors.email)} helperText={touched.email && errors.email}
            />
          </Box>

          <Box initial={{ opacity: 0, y: 20 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}   >
              <Link component={RouterLink} variant="subtitle2" to="/login" underline="hover">Back to signin?</Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >
              {isSubmitting ? "loading..." : "Reset password"}
            </LoadingButton>
          </Box>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default ForgotPasswordForm;
