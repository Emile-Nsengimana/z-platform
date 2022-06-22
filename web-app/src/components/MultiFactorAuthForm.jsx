import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { multiFactorAuth } from "../api/auth";

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

const MultiFactorAuthForm = () => {
  const navigate = useNavigate();

  const ValidationSchema = Yup.object().shape({
    otp: Yup.string().required("OTP code is required"),
  });


  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await multiFactorAuth(values);

      if (!res.data.error && !res.data.RangeError) navigate("/", { replace: true });
      else setSubmitting(false);
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box animate={{ transition: { staggerChildren: 0.55, }, }} >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }} initial={{ opacity: 0, y: 40 }} animate={animate}>

            <TextField fullWidth type="text" label="Authentication code"
              {...getFieldProps("otp")} error={Boolean(touched.otp && errors.otp)} helperText={touched.otp && errors.otp}
            />
          </Box>

          <Box initial={{ opacity: 0, y: 20 }} animate={animate}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}   >
              <Link component={RouterLink} variant="subtitle2" to="/login" underline="hover">Back to signin?</Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >
              {isSubmitting ? "loading..." : "Verify"}
            </LoadingButton>
          </Box>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default MultiFactorAuthForm;
