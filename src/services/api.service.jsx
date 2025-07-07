

export const LoginService =async ()=>{
    let result;
    const dataa={
    "email": "yogaraj@example.com",
    "password": "12334"
}
    try {
             await fetch('http://localhost:8000/api/v1/login',{method:'POST',body:dataa}).then((res)=>{
                result = res.data
                console.log('resu;lltt',res)
            })
            
        } catch (error) {
            result = error
        }
      return  result ;
}