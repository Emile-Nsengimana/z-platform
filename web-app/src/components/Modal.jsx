import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
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
  Divider
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
 import CountryField from "./CountryField";
import MenuItem from '@mui/material/MenuItem';
import styled from "@emotion/styled";


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
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "70vh",
  height: "50vh",
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const HeadingStyle = styled(Box)({
  textAlign: "center",
});

export default function BasicModal(props) {
    const { showModal, handleClose} = props;
 
    const navigate = useNavigate();
  
    const SignupSchema = Yup.object().shape({
      identificationNumber: Yup.string()
        .min(2, "Too Short!")
        .max(50, "Too Long!")
        .required("Identification number required")
    });
  
    const formik = useFormik({
      initialValues: {
        identificationNumber: ""
      },
      validationSchema: SignupSchema,
      onSubmit: (values) => {
         console.log("values: ", values);
      },
    });
  
    const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  return (
    <div>
      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          
        <HeadingStyle>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>
              Upload identification document
            </Typography>
          </HeadingStyle>
          <Divider sx={{ my: 2 }}>
          </Divider>

        <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={4}> <Stack
            spacing={3} 
            initial={{ opacity: 0, y: 40 }}
            direction={{ xs: "column", sm: "column" }}
            animate={animate}
          >
           <TextField
              fullWidth
              label="Identification number"
              {...getFieldProps("identificationNumber")}
              error={Boolean(touched.identificationNumber && errors.identificationNumber)}
              helperText={touched.identificationNumber && errors.identificationNumber}
            />

            <TextField InputLabelProps={{ shrink: true }} inputProps={{accept: "image/png, image/gif, image/jpeg"}}
              fullWidth
              autoComplete="supportDoc"
              type="file"
              label="ID image"
            />
              
          </Stack>
          <Box 
            initial={{ opacity: 0, y: 20 }}
            animate={animate}
          >
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Submit
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
    </Box>
      </Modal>
    </div>
  );
}
