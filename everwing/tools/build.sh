TOOLS_PATH=$(pwd)
osName=$(uname)
echo $osName
macOs="Darwin"
read -p
if [ $osName = $macOs ];then
	echo "run on MacOs"
    PROJECT_PATH="/Users/admin/Jason/farm-dev"
	BUILD_PATH="/Users/admin/Jason/farm-h5-release"
else
	echo "run on Windows"
    PROJECT_PATH="/E/COKH5/COKGit/farm-h5-mini"
	BUILD_PATH="/E/COKH5/COKGit/farm-h5-release"
fi
echo $PROJECT_PATH
echo $BUILD_PATH
echo $TOOLS_PATH
if [ $osName = $macOs ];then
/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path $PROJECT_PATH --build "platform=web-mobile;buildPath=$BUILD_PATH" 
else
C:/CocosCreator/CocosCreator.exe --path $PROJECT_PATH --build "platform=web-mobile;buildPath=$BUILD_PATH" 
fi
cd $TOOLS_PATH
python build.py $PROJECT_PATH "$BUILD_PATH/web-mobile"
echo "build finish"
