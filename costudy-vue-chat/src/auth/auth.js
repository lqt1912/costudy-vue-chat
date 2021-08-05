import constants  from "../constants/constants"

export default{
    login(userName, password){
        const data = {
            email: userName, 
            password: password
        }
        const result = fetch(`${constants.API_URL}/Accounts/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
      })
      .then((response)=>{
        if(response.ok){
            return response.json()
        }
      })
      .catch((error)=>{
        console.log(error);
        this.error = error.message;
      })
      console.log(result);
      return result;
    }
}