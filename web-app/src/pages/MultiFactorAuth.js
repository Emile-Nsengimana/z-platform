import React from "react";
import { Container, Typography, Box } from "@mui/material";
import styled from "@emotion/styled";
import MultiFactorAuthForm from "../components/MultiFactorAuthForm";

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

const MultiFactorAuth = (props) => {

  return (
    <RootStyle>
      <Container maxWidth="sm">
        <ContentStyle>
          <HeadingStyle  >
            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              Two factor authentication
            </Typography>
          </HeadingStyle>
          <MultiFactorAuthForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
};

export default MultiFactorAuth;
