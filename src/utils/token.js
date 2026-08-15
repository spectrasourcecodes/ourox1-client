const getToken = () => {
  const token = localStorage.getItem('authToken');
  return token
}

export default getToken;