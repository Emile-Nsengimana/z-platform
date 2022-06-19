import * as React from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {
  Stack,
  Box,
  TextField,
  Divider
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styled from "@emotion/styled";
import { uploadId } from "../api/auth";

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

export default function UploadIdForm(props) {
  const { showModal, handleClose } = props;

  const SignupSchema = Yup.object().shape({
    identificationNumber: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Identification number required")
  });

  const formik = useFormik({
    initialValues: {
      identificationNumber: "",
      additionalDoc: ""
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await uploadId(values);
      if (!res.error) handleClose();
      else {
        // setSubmitting(false);
        handleClose();
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  return (
    <div>
      <Modal open={showModal} onClose={handleClose} >
        <Box sx={style}>
          <HeadingStyle>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>
              Upload ID image for verification
            </Typography>
          </HeadingStyle>
          <Divider sx={{ my: 2 }}></Divider>

          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Stack spacing={3} initial={{ opacity: 0, y: 40 }} direction={{ xs: "column", sm: "column" }} >
                  <TextField
                    fullWidth
                    label="Identification number"
                    {...getFieldProps("identificationNumber")}
                    error={Boolean(touched.identificationNumber && errors.identificationNumber)}
                    helperText={touched.identificationNumber && errors.identificationNumber}
                  />

                  <TextField InputLabelProps={{ shrink: true }} inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                    fullWidth
                    type="file"
                    label="ID image"
                    onChange={(event) => {
                      setFieldValue("additionalDoc", event.currentTarget.files[0]);
                    }}
                  />

                </Stack>
                <Box initial={{ opacity: 0, y: 20 }}>
                  <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >
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
