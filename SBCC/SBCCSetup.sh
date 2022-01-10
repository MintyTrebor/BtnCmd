#!/bin/bash
#copy config files to duet sd card folder
sudo wget https://raw.githubusercontent.com/MintyTrebor/BtnCmd/main/SBCC/SBCC_Config.json -O /opt/dsf/sd/sys/SBCC_Config.json
sudo wget https://raw.githubusercontent.com/MintyTrebor/BtnCmd/main/SBCC/SBCC_Default_Cmds.json -O /opt/dsf/sd/sys/SBCC_Default_Cmds.json
#give permissions to rw
sudo chmod a+rw /opt/dsf/sd/sys/SBCC_Default_Cmds.json
sudo chmod a+rw /opt/dsf/sd/sys/SBCC_Config.json
#copy MQTT4DSF python file to duet plugins folder
sudo mkdir /opt/dsf/plugins/SBCC
sudo chmod a+rw /opt/dsf/plugins/SBCC
sudo wget https://raw.githubusercontent.com/MintyTrebor/BtnCmd/main/SBCC/SBCC_Main.py -O /opt/dsf/plugins/SBCC/SBCC_Main.py
#give permissions to rw
sudo chmod a+rwx /opt/dsf/plugins/SBCC/SBCC_Main.py
#create the service
if [ -f /etc/systemd/system/SBCCSvs.service ]; then
 sudo systemctl stop SBCCSvs.service
 sudo systemctl disable SBCCSvs.service
else
 sudo wget https://raw.githubusercontent.com/MintyTrebor/BtnCmd/main/SBCC/SBCCSvs.service -O /etc/systemd/system/SBCCSvs.service
fi
sudo systemctl enable SBCCSvs.service
sudo systemctl daemon-reload
echo "  "
echo "Type 'sudo systemctl start SBCCSvs.service' to start SBCC Service."