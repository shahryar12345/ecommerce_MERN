const Log=require('./model/Logs');
var isEnable=true;

module.exports.addLog=async (newLog)=>{
    if(isEnable)
        await Log.addLog(newLog);
}

module.exports.setEnable=(status)=>{
    isEnable=status;
}