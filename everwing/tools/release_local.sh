#git stash save "${time}"
git pull origin release_auto
sh build.sh
read -p "Press any key to continue."