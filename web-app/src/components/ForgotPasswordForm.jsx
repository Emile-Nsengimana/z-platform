import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { forgotPassword } from "../api/auth";

const ForgotPasswordForm = () => {

  const ValidationSchema = Yup.object().shape({
    email: Yup.string().email("invalid email address").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await forgotPassword(values.email);
      if (res.error) setSubmitting(false);
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

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
