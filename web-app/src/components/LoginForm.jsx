import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
import { login } from "../api/auth";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("invalid email address").required("Email is required"),
    password: Yup.string().required("password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await login(values);

      if (!res.data.error) navigate("/verify", { replace: true });
      else setSubmitting(false);
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box animate={{ transition: { staggerChildren: 0.55, }, }} >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }} initial={{ opacity: 0, y: 40 }}>
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

          <Box initial={{ opacity: 0, y: 20 }}>
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
