import * as Yup from "yup";
import { useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Box,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
import CountryField from "./CountryField";
import MenuItem from '@mui/material/MenuItem';
import { registerUser } from "../api/auth";
import toast from 'react-hot-toast';


const SignupForm = ({ setAuth }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("First name required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Last name required"),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      dob: "",
      age: "",
      maritalStatus: "",
      nationality: "",
      profilePicture: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await registerUser(values);
      if (res.error) setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Stack initial={{ opacity: 0, y: 60 }} direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps("firstName")}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps("lastName")}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>
          <Stack
            initial={{ opacity: 0, y: 60 }}
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <TextField InputLabelProps={{ shrink: true }}
              fullWidth
              type="date"
              label="Date of birth"
              InputProps={{ inputProps: { max: "2022-01-01" } }}
              {...getFieldProps("dob")}
            />

            <TextField
              fullWidth
              label="Age"
              {...getFieldProps("age")}
            />
          </Stack>
          <Stack spacing={3} initial={{ opacity: 0, y: 40 }} direction={{ xs: "column", sm: "row" }}>
            <TextField
              fullWidth
              autoComplete="email"
              type="email"
              label="Email address"
              {...getFieldProps("email")}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              label="Gender"
              name="gender"
              variant="outlined"
              {...getFieldProps("gender")} select
            >
              <MenuItem value="Female"> Female </MenuItem>
              <MenuItem value="Male"> Male </MenuItem>
            </TextField>
          </Stack>
          <Stack spacing={3} initial={{ opacity: 0, y: 40 }} direction={{ xs: "column", sm: "row" }}>
            <TextField
              fullWidth
              name="gender"
              variant="outlined"
              label="Marital status"
              {...getFieldProps("maritalStatus")} select
            >
              <MenuItem value="SINGLE"> Single </MenuItem>
              <MenuItem value="MARRIED"> Married </MenuItem>
              <MenuItem value="DIVORCED"> Divorced </MenuItem>
              <MenuItem value="WIDOWED"> Widowed </MenuItem>
            </TextField>
            <CountryField {...getFieldProps("nationality")} />
          </Stack>
          <Stack spacing={3} initial={{ opacity: 0, y: 40 }} direction={{ xs: "column", sm: "row" }}   >
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              {...getFieldProps("password")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}  >
                      <Icon icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
            <TextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm password"
              {...getFieldProps("confirmPassword")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowConfirmPassword((prev) => !prev)}  >
                      <Icon icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Stack
            spacing={3}
            initial={{ opacity: 0, y: 40 }}
            direction={{ xs: "column", sm: "row" }}
          >
            <TextField InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
              fullWidth
              type="file"
              label="Profile image" onChange={(event) => {
                setFieldValue("profilePicture", event.currentTarget.files[0]);
              }}
            // {...getFieldProps("profilePicture")} 
            />

          </Stack>
          <Box
            initial={{ opacity: 0, y: 20 }}
          >
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Sign up
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default SignupForm;
