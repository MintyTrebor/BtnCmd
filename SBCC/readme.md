***NOTE: REQUIRES BtnCmd 0.10.13+***  
  
This service allows shell commands to be sent to the SBC from a BtnCmd button. 

***DSF must already installed and working with plugins enabled on the SBC before installing this service***  

***You must enable SBCC in BtnCmd global settings, and configure the SBCC settings before starting this service***

Install python3 on SBC if not already installed (normally already installed on most pi's). eg:
```
sudo apt install python3  
```  
Download & Copy the .py file into the btncmd plugin folder on the sbc (eg /opt/dsf/plugins/BtnCmd/dwc)  
```
sudo wget https://raw.githubusercontent.com/MintyTrebor/BtnCmd/main/SBCC/SBCC_Main.py -O /opt/dsf/plugins/BtnCmd/dwc/SBCC_Main.py
```
Download the svs (optional below) or create the service manually (use the SBCCSvs.service file as reference)
```
sudo wget https://raw.githubusercontent.com/MintyTrebor/BtnCmd/main/SBCC/SBCCSvs.service -O /etc/systemd/system/SBCCSvs.service
```
Enable the service  
```
sudo systemctl enable SBCCSvs.service
sudo systemctl daemon-reload
```  
Start the service - Note the service will fail to start if you have not already enabled SBCC in BtnCmd.
```
sudo systemctl start SBCCSvs.service
```  
Check the service is running (ctrl+c to exit check)
```
sudo systemctl status SBCCSvs.service
```

