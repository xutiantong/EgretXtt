#git stash save "${time}"
git pull origin mini
sh build.sh
sh git.sh
read -p "Press any key to continue."