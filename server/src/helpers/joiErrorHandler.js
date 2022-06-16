const groupErrors = (validationResponse) => {
  const errors = [];

  const { details } = validationResponse.error;
  for (let i = 0; i < details.length; i += 1) {
    errors.push(details[i].message.replace('"', '').replace('"', ''));
  }
  return errors.errors.message;
};
export default groupErrors;
