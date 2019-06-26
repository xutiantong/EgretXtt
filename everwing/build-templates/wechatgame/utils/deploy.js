
// 访问外网测试一服 var env = 'test'
// 访问外网测试二服 var env = 'dev'
// 访问外网正式服 var env = 'release'

var env = 'test'
 
var tempConfig = require('./deploy.' + env + '.js')


function getCurrentEnvironment(){
	return env;
}
/**返回农场socketUrl */
function getCurrentFarmSocketUrl(){
  return tempConfig.data.farmUrl
}
/**返回cdn */
function getCDNUrl(){
  return tempConfig.data.cdn
}

module.exports = {
  env: env,
  getCurrentEnvironment: getCurrentEnvironment,
  getCDNUrl:getCDNUrl,
  getCurrentFarmSocketUrl:getCurrentFarmSocketUrl,
};
