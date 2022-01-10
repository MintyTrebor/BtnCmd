#!/usr/bin/env python3

import signal
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from io import BytesIO
import os
import subprocess

SBCC_Settings_json = {}
SBCC_Cmds_json = {}
SBCC_Def_Cmds = {}
SBCC_API_KEY = "0"


class SBCC_Startup():
    SETTINGS_FILE = "/opt/dsf/sd/sys/SBCC_Config.json"
    #SETTINGS_FILE = "/home/minty/dev/SBC/SBCC/SBCC_Config.json"
    DEF_CMDS_FILE = "/opt/dsf/sd/sys/SBCC_Default_Cmds.json"
    #DEF_CMDS_FILE = "/home/minty/dev/SBC/SBCC/SBCC_Default_Cmds.json"

    def __init__(self):
        self._load_settings()
        
    def _load_settings(self):
        with open(self.DEF_CMDS_FILE) as json_settings2:
            global SBCC_Def_Cmds
            SBCC_Def_Cmds = json.load(json_settings2)
        with open(self.SETTINGS_FILE) as json_settings:
            global SBCC_Settings_json
            global SBCC_Cmds_json
            global SBCC_API_KEY
            SBCC_Cmds_json = json.load(json_settings)        
            SBCC_Settings_json = SBCC_Cmds_json["SBCC_Settings"]
            SBCC_API_KEY = str(SBCC_Settings_json["API_KEY"])
        self.startListening()

    def _init_worker(self):
        signal.signal(signal.SIGINT, signal.SIG_IGN)

    def startListening(self):
        self.serverPort = int(SBCC_Settings_json["HTTP_Port"])
        self.httpd = HTTPServer(('', self.serverPort), SBCC_RequestHandler)
        self.httpd.serve_forever()

class SBCC_RequestHandler(BaseHTTPRequestHandler):

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "x-api-key,Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        #Execute the cmd and create the response body
        try:
            tmpBodyStr = body.decode('utf8').replace("'", '"')
            tmpjson = json.loads(tmpBodyStr)
            #Check if API Key Matches - Do nothing if it does not (no response)
            if str(tmpjson["SBCCAPI"]) == str(SBCC_API_KEY):
                self.send_response(200)
                self._send_cors_headers()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                if int(tmpjson["SBCCID"]) == 0:
                    tmpCmdID = str(tmpjson["SBCCID"])
                    response = BytesIO()
                    tmpRespJson = {
                        'SBCC_Confirm': 'SBCC has recieved the request', 
                        'SBCC_CMD_ID': tmpCmdID,
                        'Cmd_Response': 'Restarting SBCC Service'
                        }
                    self.wfile.write(response.getvalue())
                    tmpExecuted = self.executeSBCC_Cmd(int(tmpjson["SBCCID"]))
                else:
                    tmpExecuted = self.executeSBCC_Cmd(int(tmpjson["SBCCID"]))
                    tmpCmdID = str(tmpjson["SBCCID"])
                    response = BytesIO()
                    tmpRespJson = {
                        'SBCC_Confirm': 'SBCC has recieved the request', 
                        'SBCC_CMD_ID': tmpCmdID,
                        'Cmd_Response': tmpExecuted
                        }
                    tmpRespBin = json.dumps(tmpRespJson).encode()
                    response.write(tmpRespBin)
                    self.wfile.write(response.getvalue())
            else:
                self.send_response(404)
                self.end_headers()

        except Exception as e:
            #return error
            self.send_response(404)
            self.end_headers()
            errstr = str(e)
            response = BytesIO()
            response.write(errstr.encode())
            self.wfile.write(response.getvalue())

    
    def exeSBCC_Cmd(self, CmdText, CmdTimeout):
        #execute the command on the SBC
        try:
            stream = subprocess.run(CmdText, text=True, shell=True, timeout=int(CmdTimeout), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except subprocess.TimeoutExpired:
            return "The command has timedout."
        if stream.returncode:
            errno = stream.returncode
            error = stream.stderr
            msg = "Command '{}' returned non-zero exit status {}\n{}"
            return msg.format(CmdText, errno, error)
        elif stream.stdout == "":
            msg = "The command returned no data: {}"
            return msg.format(stream.stderr)    
        else: 
            return str(stream.stdout)
    
    def executeSBCC_Cmd(self, cmdIDRecieved):
        if cmdIDRecieved < 1000:
            #this is a pre-defined inbuilt cmd
            if cmdIDRecieved == 0:
                self.exeSBCC_Cmd("systemctl restart SBCCSvs.service", 30)
                return
            else:
                for attrs in SBCC_Def_Cmds["SBCC_Cmds"]:
                    if int(attrs["SBCC_Cmd_ID"]) == cmdIDRecieved:
                        return self.exeSBCC_Cmd(attrs["SBCC_Cmd_CmdText"], int(attrs["SBCC_Cmd_Timeout"]))
                return "Command ID is invalid"    
        else:
            #this is a user defined cmd
            for attrs in SBCC_Cmds_json["SBCC_Cmds"]:
                if int(attrs["SBCC_Cmd_ID"]) == cmdIDRecieved:
                    return self.exeSBCC_Cmd(attrs["SBCC_Cmd_CmdText"], int(attrs["SBCC_Cmd_Timeout"]))
            return "Command ID is invalid"    
                
    

SBCC_Startup()
