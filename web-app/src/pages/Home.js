import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container, Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useMyContext } from "../AppProvider";
import NavBar from "../components/NavBar";
import Modal from "../components/UploadIdForm";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const Home = () => {
  const state = useMyContext();
const accessToken =  window.sessionStorage.getItem('access_token');
  const isAauthenticated = accessToken !== null;
    const user = JSON.parse(window.sessionStorage.getItem('user'));
    const [authenticated, setAuthenticated] = React.useState(isAauthenticated);
    const [userProfile, setUserProfile] = React.useState(user);

  
  const theme = useTheme();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(authenticated, isAauthenticated);
    if(!authenticated) navigate("/login", { replace: false });

  }, [authenticated]);


console.log(authenticated);
  return (
    <>
               <NavBar userProfile={userProfile} />
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        // height: "90vh",
        marginTop: 15
      }}
    >
{userProfile != null &&  <Grid container spacing={2} rowSpacing={4} >

{userProfile.profileImage && <Grid item xs={12} xm={4} md={4}>
   <Item><img style={{ width: "300px", height: "300px", borderRadius: "50%" }} src={userProfile.profileImage} /></Item>
</Grid> }
<Grid item xs={12} md={8}>
  <Item style={{ height: "320px", textAlign: "left", paddingLeft: "50px" }}>
    <p><span style={{fontWeight: 700}}>Name: </span>{userProfile.firstName} {userProfile.lastName} {userProfile.status === 'VERIFIED' && <VerifiedIcon style={{ color: "green", fontSize: "15", marginTop: "10px" }} />}</p>
    <p><span style={{fontWeight: 700}}>Email: </span>{userProfile.email}</p>
    <p><span style={{fontWeight: 700}}>Age: </span>{userProfile.age}</p>
    <p><span style={{fontWeight: 700}}>Gender: </span>{userProfile.gender}</p>
    <p><span style={{fontWeight: 700}}>Marital status: </span>{userProfile.maritalStatus}</p>
    <p><span style={{fontWeight: 700}}>Nationality: </span>{userProfile.nationality}</p>
    <p><span style={{fontWeight: 700}}>ID number: </span>{userProfile.identificationNumber}</p>
  </Item>
</Grid>

</Grid>}
     
     
    </Container>
    </>
  );
};
export default Home;
