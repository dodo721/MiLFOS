#!/bin/bash

mkdir logs
dt=$(date '+%d-%m-%Y_%H:%M:%S')
file=logs/cilog-$dt.txt
touch $file
echo ">>>>>>>>>>>> GIT PULL" >> $file
git pull >> $file
echo "<<<<<<<<<<<< END GIT PULL" >> $file
#echo ">>>>>>>>>>>> COMPILE" >> $file
#npm run compile >> $file
#echo "<<<<<<<<<<<< END COMPILE" >> $file
echo "============ CI UPDATE COMPLETE" >> $file
