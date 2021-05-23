// module.exports = {
//     BASE_URL: 'http://192.168.0.100:7000/api/' //DEBUG
//     //BASE_URL: 'http://3.92.2.207:7000/api/' //DEPLOYMENT
// }

const prod = {
  // BASE_URL: 'http://ec2-52-15-80-58.us-east-2.compute.amazonaws.com:8080/api/' //PRODUCTION
  //BASE_URL: 'http://lashcart.com.au/api/'

  //BASE_URL: 'http://localhost:'+process.env.PORT+'/api/', //
  //BASE_URL: 'http://ec2-3-6-36-149.ap-south-1.compute.amazonaws.com/api/'
  //BASE_URL: 'http://seller.lashcart.com.au/api/'
  BASE_URL: 'https://shrouded-gorge-98113.herokuapp.com/api/', //DEBUG
  

  //BASE_URL: 'http://192.168.0.103:8080/api/' //DEBUG


};
const dev = {
  //BASE_URL: 'http://192.168.0.103:8080/api/' //DEBUG
  BASE_URL: 'https://shrouded-gorge-98113.herokuapp.com/api/', //DEBUG
  
  //BASE_URL: 'http://localhost:'+process.env.PORT+'/api/', //DEBUG
  //BASE_URL: 'http://ec2-3-6-36-149.ap-south-1.compute.amazonaws.com/api/'
  //BASE_URL: 'http://seller.lashcart.com.au/api/'
};

// export const config = process.env.NODE_ENV === "development" ? dev : prod;
module.exports = {
  BASE_URL: process.env.NODE_ENV === 'development' ? dev.BASE_URL : prod.BASE_URL,
};
