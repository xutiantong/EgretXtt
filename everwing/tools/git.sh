echo "push to git"
time=$(date "+%Y%m%d-%H%M%S")
cd $(pwd)
git add -A
userName=$(git config user.name)
git commit -m "release by $userName at $time"
git push 
