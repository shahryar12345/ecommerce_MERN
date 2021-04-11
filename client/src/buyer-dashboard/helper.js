const axios = require('axios');
const { BASE_URL } = require('./../apibase');
export const addToCart= async (PID , quantity)=>{
        
   try{
    var user = localStorage.getItem('local-buyer')
    user = JSON.parse(user)
    console.log("USER " , user)
    console.log("PID" , PID)
    const res = await axios.get(BASE_URL  + `buyer/addCartItem?buyerID=${user.id}&productID=${PID}&quantity=${quantity}` )
    if(res){
        return res
    }
    
   }
   catch(err){
       console.log(err)
   }
}