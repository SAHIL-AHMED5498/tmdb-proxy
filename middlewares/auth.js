
require('dotenv').config();
const internal_key=process.env.INTERNAL_KEY;

//SIMPLE AUTH CHECK TO CREATE PROTECTED ROUTES
const auth=(req,res,next)=>{
  const client_key=req.headers["internal-key"];
  try{
      if(client_key!=internal_key){
    throw new Error("Accessed Denied");
    
  }
  else{
    next();
  }


}catch(err){
  console.log(err);
  res.status(400).send(`Failed to access ${err.message}`);

}

  }

  module.exports={auth}