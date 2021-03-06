#!/usr/bin/python
# coding-utf8

'''
Developer: Kaibo(lrushx)
Email: liukaib@oregonstate.edu
Created Date: Jan 27, 2018
'''

import flask
import flask_cors
from werkzeug.utils import secure_filename 
import os
import time
import re
import json
import arc_pairing_single_json

app = flask.Flask(__name__)
flask_cors.CORS(app)

fileDir = "/nfs/stak/users/liukaib/public_html/usrData/"
#fileDir = os.path.join(os.getcwd(),"usrData")
logFile = "/nfs/stak/users/liukaib/public_html/demo_data_run/usrLog.txt"
logFile2 = "./usrLog.txt"
pairingDir = "/nfs/stak/users/liukaib/public_html/demo_data_run/"

demoURL = '/'
pairingName = ''
Beamsize = 100
Lc = ''
Lv = ''
Seq = ''
Info = '' 
T = 0
@app.route(demoURL)
def my_form():
    #return flask.render_template('myform.html')
    return flask.render_template('interface.html')

#print flask.Flask.__doc__
@app.route('/hello')
def hello_world():
    return 'Hello World!'

@app.route('/<name>')
def show(name):
    #global pairingRes
    return flask.render_template('showResult.html', pairingRes=pairingName, beamsize=Beamsize, lc=Lc, lv=Lv, seq=Seq, info=Info)

@app.route(demoURL, methods=['GET', 'POST'])
def inputSeq():
    if flask.request.method == 'POST':
        input_flag = False
        beamsize = flask.request.form['beamSize']
        if not beamsize: beamsize = '100'
        text = flask.request.form['seqInput']
        filename = str(time.time()) + '_'
        usrIP = flask.request.remote_addr
        if text == '': 
            if 'seqFile' not in flask.request.files:
                seq = 'AUCGGGCUAUUACG'
                seqName = 'noName'
                input_flag = True
                #return 'No input, nor selected file'
            # upload part
            else:
                file = flask.request.files['seqFile']
                #filename += secure_filename(file.filename)
                #filename = filename[:-4]
                tmpPath = os.path.join(fileDir,'tmp')
                file.save(tmpPath)
                input_flag = True

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
            seqName = text[1:lineStop]
            seq     = text[lineStop+1:]

        if input_flag:
            seq = seq.replace('\n','')
            seq = seq.replace(' ','')
            if ''.join(re.findall('[^AUCG]+',seq)):
                return 'wrong input, only A/U/C/G is supposed in sequences'

            seqName = secure_filename(seqName)
            filename += seqName 
            newPath = os.path.join(fileDir,filename)
            f = open(newPath,'w')
            f.write("{}\n{}\n{}".format(seqName, seq, beamsize))
	    f.close()
            T0 = time.time()
            t1, t2 = request_ironcreek(filename)
            T1 = time.time() - T0 
            print T1

            outLc = pairingDir + filename + '.lc.res'             # output path for linearFold-C
            outLv = pairingDir + filename + '.lv.res'             # output path for linearFold-V

            f_lc = open(outLc)
            f_lv = open(outLv)
       
            lc = f_lc.readlines()
            lv = f_lv.readlines()
            f_lc.close()
            f_lv.close()
       
            #return processed_text,newPath
            pairingFile = pairingDir + filename + '.pairing.res'#pairingName
            arc_pairing_single_json.LoadSave(pairingFile,seq,lc[6][:-1],lv[6][:-1],t1,t2,beamsize,seqName)
            with open(pairingFile) as f:
                pData = json.load(f)

            global pairingName, Beamsize, Lc, Lv, Seq, Info
            pairingName = filename + '.pairing.res'
            Lc, Lv, Seq = pData['pairing'][6], pData['pairing'][7], seq
            Info, Beamsize = ">> linearFold-C\n{}>> linearFold-V\n{}".format(lc[-1],lv[-1]), beamsize
            logInfo = "[{0}] [len: {1:0>7}] [time: {2:0>12.5f}s] [file: {3}]".format(time.asctime(), len(seq) , T1, filename) 
            addlog(logInfo, usrIP)
            newpairingFile = './demo_data_run/'+ pairingName
            os.system('cp {} {}'.format(pairingFile,newpairingFile))
            os.system('chmod 644 '+newpairingFile) 
            newurl = flask.url_for('show',name=seqName)
            return flask.redirect(newurl)

            #show(pairingFile)
            return Info + '<br>name:&nbsp&nbsp' + seqName + '<br>seq:&nbsp&nbsp&nbsp&nbsp' + seq+'<br><br><br>'+resInfo.replace('\n','<br>')+'<br>'+pData['pairing'][6]+'<br><br>'+pData['pairing'][7]


def addlog(logInfo, usrIP):
    os.system("echo {} [IP: {}] >> {}".format(logInfo, usrIP, logFile))
    os.system("cp {} {}".format(logFile, logFile2))


def request_ironcreek(seqfile):
    import socket               # import socket module
    s1, s2 = socket.socket(), socket.socket()         # creat socket object
    host = 'ironcreek.eecs.oregonstate.edu'
    port1, port2 = 11110, 11111                # set port
    
    s1.connect((host, port1))
    s2.connect((host, port2))
    s1.send(seqfile)
    s2.send(seqfile)
    t1 = s1.recv(1024)
    t2 = s2.recv(1024)
    
    s1.close()
    s2.close()

    return t1, t2 


if __name__ == '__main__':
    #app.logger.debug('message processed')
    app.logger.info('message processed')
    #app.run(host='128.193.36.41', port=8001) #, debug=True) # flip.engr.oregonstate.edu
    #app.run(host='73.67.241.185', port=8080) #, debug=True) # flop.engr.oregonstate.edu
    #app.run(host='128.193.40.12', port=22) #, debug=True)  # web.engr.oregonstate.edu
    app.run(host='128.193.38.37', port=4000, debug=True)  # linearfoldtest.eecs.oregonstate.edu
    #app.run(host='0.0.0.0', port=8080)# , debug=True)
    #app.run(host='0.0.0.0') #, debug=True)
    #app.run(debug=True)
    #app.run()
