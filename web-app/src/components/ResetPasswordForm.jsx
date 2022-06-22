import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
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
import { resetPassword } from "../api/auth";
import toast from 'react-hot-toast';

const LoginForm = () => {
  const { search } = useLocation();
  const token = React.useMemo(() => new URLSearchParams(search), [search]).get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ValidationSchema = Yup.object().shape({
    newPassword: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await resetPassword(values, token);

      if (!res.error) {
        toast.success("you can now login with your new password");
        // navigate("/login", { replace: true });
      } else setSubmitting(false);
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box animate={{ transition: { staggerChildren: 0.55, }, }} >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }} initial={{ opacity: 0, y: 40 }}>

            <TextField fullWidth type={showPassword ? "text" : "password"} label="New password"  {...getFieldProps("newPassword")}
              error={Boolean(touched.newPassword && errors.newPassword)}
              helperText={touched.newPassword && errors.newPassword}
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

            <TextField fullWidth type={showConfirmPassword ? "text" : "password"} label="Confirm password"  {...getFieldProps("confirmPassword")}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)}   >
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
              <Link component={RouterLink} variant="subtitle2" to="/login" underline="hover">Back to signin?</Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >
              {isSubmitting ? "loading..." : "Reset"}
            </LoadingButton>
          </Box>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default LoginForm;
