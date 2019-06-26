TOOLS_PATH=$(pwd)
PROJECT_PATH="/E/COKH5/COKGit/farm-h5-mini"
BUILD_PATH="/E/COKH5/COKGit/farm-h5-release"
echo $PROJECT_PATH
echo $BUILD_PATH
echo $TOOLS_PATH
cd $TOOLS_PATH
python build.py $PROJECT_PATH "$BUILD_PATH/web-mobile"
read -p "Press any key to continue."