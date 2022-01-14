***DSF must already installed and working with plugins enabled on the SBC before installing this service***  
***Requires BtnCmd 0.10.06+ & RRF 3.4b7+***  
***You must enable SBCC in BtnCmd global settings, and configure the API key and Subnet before enabling and starting this service***

Install python3 on SBC if not already installed (normally already installed on most pi's). eg:
```
sudo apt install python3  
```  

Download the svs
```
sudo wget https://raw.githubusercontent.com/MintyTrebor/BtnCmd/main/SBCC/SBCCSvs.service -O /etc/systemd/system/SBCCSvs.service
```
Enable the service  
```
sudo systemctl enable SBCCSvs.service
sudo systemctl daemon-reload
```  
Start the service
```
sudo systemctl start SBCCSvs.service
```  
Check the service is running (ctrl+c to exit check)
```
sudo systemctl status SBCCSvs.service
```

