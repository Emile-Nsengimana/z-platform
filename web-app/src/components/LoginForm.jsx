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

let easing = [0.6, -0.05, 0.01, 0.99];
const animate = {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.6,
    ease: easing,
    delay: 0.16,
  },
};

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const handleStateUpdate = useMyUpdateContext();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (payload) => {
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
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const { errors, touched, values, isSubmitting, setIsSubmitting, handleSubmit, getFieldProps } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box animate={{ transition: { staggerChildren: 0.55, }, }} >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }} initial={{ opacity: 0, y: 40 }} animate={animate}>
            <TextField fullWidth autoComplete="username" type="email" label="Email Address"
              {...getFieldProps("email")} error={Boolean(touched.email && errors.email)} helperText={touched.email && errors.email}
            />

            <TextField fullWidth autoComplete="current-password" type={showPassword ? "text" : "password"} label="Password"  {...getFieldProps("password")}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)}   >
                      {showPassword ? <Icon icon="eva:eye-fill" />
                        : <Icon icon="eva:eye-off-fill" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box initial={{ opacity: 0, y: 20 }} animate={animate}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}   >
              <Link component={RouterLink} variant="subtitle2" to="/forgot-password" underline="hover">Forgot password?</Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >
              {isSubmitting ? "loading..." : "Login"}
            </LoadingButton>
          </Box>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default LoginForm;
