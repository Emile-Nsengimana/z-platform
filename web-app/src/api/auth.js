import axios from "axios";
import toast from 'react-hot-toast';


export const registerUser = async (formData) => {
  try {
    const header = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    const info = new FormData();
    info.append("firstName", formData.firstName);
    info.append("lastName", formData.lastName);
    info.append("gender", formData.gender);
    info.append("dob", formData.dob);
    info.append("age", formData.age);
    info.append("maritalStatus", formData.maritalStatus);
    info.append("email", formData.email);
    info.append("password", formData.password);
    info.append("confirmPassword", formData.confirmPassword);
    info.append("nationality", formData.nationality);
    info.append("profilePicture", formData.profilePicture);

    const URL = "/auth/signup";
    const res = await axios.post(URL, info, header);

    if (res.status === 201) {
      toast.success(res.data.message);
      return res.data;
    }
  } catch (error) {
    toast.error(error.response.data.error);
    return error.response.data;
  }
};

/**
 * 
 * @param {Object} authPayload 
 * @returns {object} short lived token
 */
export const login = async (authPayload) => {

  try {
    const header = {
      headers: { "Content-Type": "application/json" },
    };

    const URL = "/auth/signin";
    const res = await axios.post(URL, authPayload, header);

    if (res.status === 200) {
      toast.success(res.data.message);
      window.sessionStorage.setItem('access_token', res.data.data.token);

      return res.data;
    }

  } catch (error) {
    toast.error(error.response.data.error);
    return error.response;
  }
};

/**
 * Accepts authPayload object with OTP code
 * @param {Object} authPayload 
 * @returns {Object} user + token
 */
export const multiFactorAuth = async (authPayload) => {
  try {
    const accessToken = window.sessionStorage.getItem('access_token');

    // request header
    const header = {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken
      },
    };

    const URL = "/auth/multi-factor";
    const res = await axios.post(URL, authPayload, header);

    if (res.status === 200) {
      toast.success(res.data.message);

      window.sessionStorage.setItem('access_token', res.data.data.token);
      window.sessionStorage.setItem('user', JSON.stringify(res.data.data));

      return res.data;
    }

  } catch (error) {
    if (error.response.data?.RangeError) {
      toast.error(error.response.data?.RangeError);
    } else {
      toast.error(error.response.data.error);
    }
    return error.response;
  }
};

/**
 * Accepts formData object with ID Number, ID image
 * @param {object} formData 
 * @returns {string} message
 */
export const uploadId = async (formData) => {
  try {
    const accessToken = window.sessionStorage.getItem('access_token');

    const header = {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-access-token": accessToken
      },
    };

    // create a form data instance
    const info = new FormData();
    info.append("identificationNumber", formData.identificationNumber);
    info.append("additionalDoc", formData.additionalDoc);

    const URL = "/auth/users";
    const res = await axios.put(URL, info, header);

    if (res.status === 200) {
      toast.success(res.data.message);
      return res.data;
    }
  } catch (error) {
    toast.error(error.response.data.error);
    return error.response.data;
  }
};

/**
 * Forgot password
 * @param {string} email 
 * @returns {object} response containing acknowledge message
 */
export const forgotPassword = async (email) => {
  try {
    const URL = `/auth/forgot-password/${email}`;
    const res = await axios.put(URL);

    if (res.status === 200) toast.success(res.data.message);
    return res.data;
  } catch (error) {
    toast.error(error.response.data.error);
    return error.response.data;
  }
};

/**
 * Reset password
 * @param {object} payload
 * @param {string} token 
 * @returns {object} response containing acknowledge message
 */
export const resetPassword = async (payload, token) => {
  try {
    const header = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const URL = `/auth/reset?token=${token}`;
    const res = await axios.put(URL, payload, header);

    if (res.status === 200) {
      toast.success(res.data.message);
      return res.data;
    }

  } catch (error) {
    toast.error(error.response.data.error);
    return error.response.data;
  }
};