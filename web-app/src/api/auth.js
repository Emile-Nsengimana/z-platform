import axios from "axios";
 
export const registerUser = async(formData) => {
   try{
    const header = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const info = new FormData();
    info.append("firstName", formData.name);
    info.append("lastName", formData.category);
    info.append("gender", formData.stars);
    info.append("dob", formData.registrationNumber);
    info.append("age", formData.description);
    info.append("identificationNumber", formData.email);
    info.append("maritalStatus", formData.telephone);
    info.append("email", formData.facebook);
    info.append("password", formData.instagram);
    info.append("confirmPassword", formData.linkedIn);
    info.append("nationality", formData.twitter);
    // info.append("profilePicture", formData.googleMap);
    // info.append("additionalDoc", formData.province);
     
      info.append("profilePicture", formData.profilePicture[0]);
      info.append("additionalDoc", formData.additionalDoc[0]);
    
    const URL = "auth/signup";
    const { data } = await axios.post(URL, info, header);

    if (data)
    {
      console.log("DATA: ", data);
    }
  } catch (error)
  {
    console.log("ERROR: ", error);
  }
};

export const login = async(authPayload) => {

  try{
   const header = {
     headers: {
       "Content-Type": "application/json",
     },
   };
   
   const URL = "auth/signin";
   const {data, status, message} = await axios.post(URL, authPayload, header);
   if(status === 200){
    window.sessionStorage.setItem('access_token', data.token);
    return data;
   }else{
     return message;
   }

   if (data)
   {
     console.log("DATA: ", data);
   }
 } catch (error){
   console.log("ERROR: ", error);
 }
};