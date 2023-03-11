const asyncHandler = require("express-async-handler");
const axios = require('axios');
const  FormData = require('form-data');
const fs = require("fs");

const uploadFileToKreo = asyncHandler(async (req, res) =>  {
    try{

   let fd= new FormData();
   fd.append('attachment', fs.createReadStream(req.file.path));
  
     let uploadres = await axios.post('https://takeoff.kreo.net/api/auto-measure/v1/company/35484/upload',fd, {
        headers: {
	      Cookie: "kreo_auth_access_token=" + req.body.kreo_auth_access_token
      }
    }).then(async ({data}) => {
          let project= await axios.post('https://takeoff.kreo.net/api/auto-measure/v1/company/35484/project?pageIndexFrom='+req.body.pageIndexFrom+'&pageIndexTo='+req.body.pageIndexTo,{value:data[0]},{
            headers: {
            Cookie: "kreo_auth_access_token=" + req.body.kreo_auth_access_token
          }
        }).then((pt)=>{
          var interval = setInterval(async()=>{
            await axios.get('https://takeoff.kreo.net/api/auto-measure/v1/company/35484/projects/'+pt.data.projectId+ '/status',{
             headers: {
             Cookie: "kreo_auth_access_token=" + req.body.kreo_auth_access_token
           }
         })
            .then(async(sts)=>
            { 
   
             if(sts.data.status=="Ready")
               {
                 res.json(sts.data);
                 clearInterval(interval);
               }
               
           }
            );
         }, 5000);
         
        });
  });
    
    }
    catch (err) {
      res.status(err.response.status);
        throw new Error(err.message);
      }
   });

   const getTokens = asyncHandler(async (req, res) => {
   try{
    let payload ={
      "email": "adithya.namada@bedrockapps.org", "password": "Adithya@123" }
   
     let resp = await axios.post('https://takeoff.kreo.net/api/auto-measure/v1/auth/login', payload);
     let cookies=resp.headers['set-cookie'];
     res.json(cookies);
   }
   catch(err){
    res.status(err.response.status);
    throw new Error(err.message);
   }
   
  });

  const getProjectStatus=asyncHandler(async (req, res) => {

    
    try{

     
      let resp = await axios.get('https://takeoff.kreo.net/api/auto-measure/v1/company/35484/projects/'+req.query.projectId+'/data?pageIndex='+req.query.pageIndex+'&withPolylines=true',{
                headers: {
                  Cookie: "kreo_auth_access_token=" + req.query.kreo_auth_access_token
                }
               })
               .then(finalres=>{

                 res.json(finalres.data);
               });
      
      
      
    }
    catch(err){
     
      res.status(err.response.status);
      throw new Error(err.message);;
      
    }
    
   });

   module.exports ={uploadFileToKreo,getTokens,getProjectStatus};