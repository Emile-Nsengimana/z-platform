import React from "react";
import { Container, Typography, Box } from "@mui/material";
import styled from "@emotion/styled";
import ResetPasswordForm from "../components/ResetPasswordForm";

const RootStyle = styled("div")({
  background: "rgb(249, 250, 251)",
  height: "100vh",
  display: "grid",
  placeItems: "center",
});

const HeadingStyle = styled(Box)({
  textAlign: "center",
});

const ContentStyle = styled("div")({
  maxWidth: 480,
  padding: 25,
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  background: "#fff",
}); 

const Login = (props) => {

  return (
    <RootStyle>
      <Container maxWidth="sm">
        <ContentStyle>
          <HeadingStyle  >
            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              Reset  password
            </Typography>
          </HeadingStyle>
          <ResetPasswordForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
};

export default Login;
