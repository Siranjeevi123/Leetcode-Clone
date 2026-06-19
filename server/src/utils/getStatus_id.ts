const status_id:{[Key:number]:string} = {
    4:"Wrong Answer",
    5:"Time Limit Exceeded",
    6:"Compilation Error",
    7:"Runtime Error",
    8:"Runtime Error",
    9:"Runtime Error",
    10:"Runtime Error",
    12:"Runtime Error",
    13:"Internal Error",
    14:"Exec Format Error",

}
const getStatus_id = (id:number)=>{
    return status_id[id];
}

export default getStatus_id;