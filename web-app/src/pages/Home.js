import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import VerifiedIcon from '@mui/icons-material/Verified';
import NavBar from "../components/NavBar";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const Home = () => {
  const accessToken = window.sessionStorage.getItem('access_token');
  const user = JSON.parse(window.sessionStorage.getItem('user'));
  const isAauthenticated = accessToken !== null && user !== null;
  
  // eslint-disable-next-line
  const [authenticated, setAuthenticated] = React.useState(isAauthenticated);

  // eslint-disable-next-line
  const [userProfile, setUserProfile] = React.useState(user);


  const navigate = useNavigate();
  useEffect(() => {
    if (!authenticated) navigate("/login", { replace: false });
  }, [authenticated, navigate]);


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
        {userProfile != null && <Grid container spacing={2} rowSpacing={4} >

          {userProfile.profileImage && <Grid item xs={12} xm={4} md={4}>
            <Item><img alt="profile" style={{ width: "300px", height: "300px", borderRadius: "50%" }} src={userProfile.profileImage} /></Item>
          </Grid>}
          <Grid item xs={12} md={8}>
            <Item style={{ height: "320px", textAlign: "left", paddingLeft: "50px" }}>
              <p><span style={{ fontWeight: 700 }}>Name: </span>{userProfile.firstName} {userProfile.lastName} {userProfile.status === 'VERIFIED' && <VerifiedIcon style={{ color: "green", fontSize: "15", marginTop: "10px" }} />}</p>
              <p><span style={{ fontWeight: 700 }}>Email: </span>{userProfile.email}</p>
              <p><span style={{ fontWeight: 700 }}>Age: </span>{userProfile.age}</p>
              <p><span style={{ fontWeight: 700 }}>Gender: </span>{userProfile.gender}</p>
              <p><span style={{ fontWeight: 700 }}>Marital status: </span>{userProfile.maritalStatus}</p>
              <p><span style={{ fontWeight: 700 }}>Nationality: </span>{userProfile.nationality}</p>
              <p><span style={{ fontWeight: 700 }}>ID number: </span>{userProfile.identificationNumber ? userProfile.identificationNumber : 'N/A'}</p>
            </Item>
          </Grid>

        </Grid>}


      </Container>
    </>
  );
};
export default Home;
