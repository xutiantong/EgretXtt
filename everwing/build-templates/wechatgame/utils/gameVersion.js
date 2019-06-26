
var data = {
    version: '1.3.1',
	debugversion:'1'
};

function getVersion(){
	return data.version
}

function getDebugVersion(){
	return data.debugversion
}

module.exports = {
    data: data,
	getVersion: getVersion,
	getDebugVersion: getDebugVersion
};
