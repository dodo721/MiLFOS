#!/bin/bash

cd ~/MiLFOS/
mkdir ./logs
file=logs/cilog.txt
touch $file
echo ">>>>>>>>>>>> GIT PULL" >> $file
git pull >> $file
echo "<<<<<<<<<<<< END GIT PULL" >> $file
#echo ">>>>>>>>>>>> COMPILE" >> $file
#npm run compile >> $file
#echo "<<<<<<<<<<<< END COMPILE" >> $file
echo "============ CI UPDATE COMPLETE" >> $file
