#!/usr/bin/python
# coding-utf8

'''
Developer: Kaibo(lrushx)
Email: liukaib@oregonstate.edu
Created Date: Jan 27, 2018
'''

from flask import Flask, request, render_template, url_for  
from werkzeug.utils import secure_filename 
import os
from time import time
import re
import json

app = Flask(__name__)

filePath = "/nfs/stak/users/liukaib/public_html/usrData/"
#filePath = os.path.join(os.getcwd(),"usrData")
logFile = "/nfs/stak/users/liukaib/public_html/demo_data_run/usrLog.txt"
logFile2 = "./usrLog.txt"
pairingDir = "/nfs/stak/users/liukaib/public_html/demo_data_run/"

demoURL = '/'
@app.route(demoURL)
def my_form():
    #return render_template('myform.html')
    return render_template('interface.html')

#print Flask.__doc__
@app.route('/hello')
def hello_world():
    return 'Hello World!'

@app.route(demoURL, methods=['GET', 'POST'])
def inputSeq():
    if request.method == 'POST':
        input_flag = False
        beamsize = request.form['beamSize']
        if not beamsize: beamsize = '100'
        text = request.form['seqInput']
        filename = str(time()) + '_'
        usrIP = request.remote_addr
        if text == '': 
            if 'seqFile' not in request.files:
                return 'No input, nor selected file'
            file = request.files['seqFile']
            '''
            if file.filename == '':
                flash('No selected file')
                return "no file"
                #return redirect(request.url)
            ''' 
            # upload part
            input_flag = True
            #filename += secure_filename(file.filename)
            #filename = filename[:-4]
            tmpPath = os.path.join(filePath,'tmp')
            file.save(tmpPath)

            with open(tmpPath) as f:
                text = f.readlines()
                if len(text) > 2 or len(text) < 1:
                    os.system("rm -f {}".format(tmpPath))
                    return 'wrong format in file'
                seqName = text[0][1:-1] if text[0][0] == '>' else text[0][:-1]
                seq     = text[-1][:-1]
                if len(text) == 1: seqName = 'NoName' 
            os.system("rm -f {}".format(tmpPath))
        else: 
            lineStop = text.find('\n')
            if lineStop == -1:
                return 'wrong input, supposed to be FASTA format'
            # input part
            input_flag = True
            seqName = text[1:lineStop]   #.upper()+' finished'
            seq     = text[lineStop+1:]

        if input_flag:
            if ''.join(re.findall('[^AUCG]+',seq)):
                return 'wrong input, only A/U/C/G is supposed in sequences'
            print seq

            seqName = secure_filename(seqName)
            filename += seqName 
            newPath = os.path.join(filePath,filename)
            f = open(newPath,'w')
            f.write("{}\n{}\n{}".format(seqName, seq, beamsize))
	    f.close()
            resInfo, logInfo = request_ironcreek(filename)
            addlog(logInfo, usrIP)
            #return processed_text,newPath
            with open(pairingDir+filename+'.pairing.res') as f:
                pData = json.load(f)
            return logInfo + '<br>name:&nbsp&nbsp' + seqName + '<br>seq:&nbsp&nbsp&nbsp&nbsp' + seq+'<br><br><br>'+resInfo.replace('\n','<br>')+'<br>'+pData['pairing'][6]+'<br><br>'+pData['pairing'][7]


def addlog(logInfo, usrIP):
    os.system("echo {} [IP: {}] >> {}".format(logInfo, usrIP, logFile))
    os.system("cp {} {}".format(logFile, logFile2))


def request_ironcreek(seqfile):
    import socket               # import socket module
    s = socket.socket()         # creat socket object
    #host = 'flip3.engr.oregonstate.edu'
    host = 'ironcreek.eecs.oregonstate.edu'
    #host = socket.gethostname() # get local host name
    port = 11113                # set port
    
    s.connect((host, port))
    s.send(seqfile)
    response_s = s.recv(1024)
    logInfo = s.recv(1024)
    if '[' in response_s:
        pos = response_s.index('[')
        logInfo = response_s[pos:]
        response_s = response_s[:pos]
    s.close()
    return response_s, logInfo

if __name__ == '__main__':
    #app.logger.debug('message processed')
    app.logger.info('message processed')
    #app.run(host='128.193.36.41', port=8001) #, debug=True) # flip.engr.oregonstate.edu
    #app.run(host='73.67.241.185', port=8080) #, debug=True) # flop.engr.oregonstate.edu
    #app.run(host='128.193.40.12', port=22) #, debug=True)  # web.engr.oregonstate.edu
    app.run(host='128.193.38.37', port=8080) #, debug=True)  # linearfoldtest.eecs.oregonstate.edu
    #app.run(host='0.0.0.0', port=8080)# , debug=True)
    #app.run(host='0.0.0.0') #, debug=True)
    #app.run(debug=True)
    #app.run()
