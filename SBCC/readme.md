***DSF must already installed and working with plugins enabled on the SBC before installing this service***  
***Requires BtnCmd 0.10.05+ & RRF 3.4b7+***  

Install python3 on SBC if not already installed (normally already installed on most pi's). eg:
```
sudo apt install python3  
```  

Download the setup script
```
wget https://raw.githubusercontent.com/MintyTrebor/BtnCmd/main/SBCC/SBCCSetup.sh
```
Make the script executable  
```
chmod u+x SBCCSetup.sh
```  
Run the script 
```
./SBCCSetup.sh
```

