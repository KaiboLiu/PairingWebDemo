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
ironcreekOutDir = "/nfs/stak/users/liukaib/public_html/demo_ironcreekOut/"
pairingDir = "./demo_data_run/"
pairingName, total_time = '',0

demoURL = '/'
@app.route(demoURL)
def my_form():
    #return flask.render_template('myform.html')
    return flask.render_template('interface.html')

@app.route('/<name>')
def showRes(name):
    #global pairingRes
    #return flask.render_template('showResult.html', pairingRes=pairingName, total_time=total_time)
    return flask.render_template('showResult.html', pairingRes=pairingName)

@app.route(demoURL, methods=['GET', 'POST'])
def inputSeq():
    if flask.request.method == 'POST':
        input_flag = False
        beamsize = flask.request.form['beamSize']
        if not beamsize: beamsize = '100'
        if int(beamsize) > 200: beamsize = '200'
        text = flask.request.form['seqInput']
        filename = str(time.time()) + '_'
        usrIP = flask.request.remote_addr

        if 'seqFile' in flask.request.files:
            usrFile = flask.request.files['seqFile']
            #filename += secure_filename(usrFile.filename)
            #filename = filename[:-4]
            tmpPath = os.path.join(fileDir,'tmp')
            usrFile.save(tmpPath)
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
        elif text == '': 
            seq = 'GGUUAAGCGACUAAGCGUACACGGUGGAUGCCCUGGCAGUCAGAGGCGAUGAAGG'
            seqName = 'noName'
            input_flag = True
            #return 'No input, nor selected file'
        # upload part
        else: 
            lineStop = text.find('\n')
            if lineStop == -1:
                return flask.redirect(flask.url_for('errorPage',text=text))
                #return 'wrong input, supposed to be FASTA format'
            # input part
            input_flag = True
            seqName = text[1:lineStop]
            seq     = text[lineStop+1:]

        if input_flag:
            seq0 = seq
            seq = seq.replace('\n','')
            seq = seq.replace('\r','')
            seq = seq.replace(' ','')
            if ''.join(re.findall('[^AUCG]+',seq)):
                return flask.redirect(flask.url_for('errorPage',text=text))
                #return 'wrong input, only A/U/C/G is supposed in sequences'

            seqName = secure_filename(seqName)
            filename += seqName 
            newPath = os.path.join(fileDir,filename)
            f = open(newPath,'w')
            f.write("{}\n{}\n{}".format(seqName, seq, beamsize))
	    f.close()
            T0 = time.time()
            t1, t2 = request_ironcreek(filename)

            outLc = ironcreekOutDir + filename + '.lc.res'             # output path for linearFold-C
            outLv = ironcreekOutDir + filename + '.lv.res'             # output path for linearFold-V

            f_lc = open(outLc)
            f_lv = open(outLv)
       
            lc = f_lc.readlines()
            lv = f_lv.readlines()
            f_lc.close()
            f_lv.close()
       
            t1 = ''.join(re.findall('Time: ([0-9]+[.0-9]{0,3})',lc[4]))
            t2 = ''.join(re.findall('Time: ([0-9]+[.0-9]{0,3})',lv[4]))
            score1 = ''.join(re.findall('score: ([\-0-9]+[.0-9]{0,3})',lc[3]))
            #score2 = ''.join(re.findall('score: ([\-0-9]+[.0-9]{0,3})',lv[3]))
            score2 = '{0:.2f}'.format(float(''.join(re.findall('score: ([\-0-9]+[.0-9]{0,3})',lv[3])))/(-100))
            print t1,t2,score1,score2
            #write results of lc, lv to a final pairing.res result
            pairingFile = pairingDir + filename + '.pairing.res'   #output with pairingName
            arc_pairing_single_json.LoadSave(pairingFile,seq,lc[6][:-1],lv[6][:-1],t1,t2,beamsize,seqName,score1,score2)

            T1 = time.time() - T0 
            print "total time = {}".format(T1)

            '''
            # extract data from json-format pairing file
            # copy pairing date from ~/public_html to local
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
            '''
            os.system('chmod 644 '+pairingFile) 
            logInfo = "[{0}] [len: {1:0>6}] [time: {2:0>12.5f}s] [file: {3}] [IP: {4}]".format(time.asctime(), len(seq) , T1, filename, usrIP) 
            addlog(logInfo)
            global pairingName#, total_time 
            pairingName = filename+'.pairing.res'
            #total_time  = '%0.2f'%(T1) 
            newurl = flask.url_for('showRes',name=seqName)#+'#pageTitle'
            #show(newurl)
            return flask.redirect(newurl)

            '''
            #show(pairingFile)
            return Info + '<br>name:&nbsp&nbsp' + seqName + '<br>seq:&nbsp&nbsp&nbsp&nbsp' + seq+'<br><br><br>'+resInfo.replace('\n','<br>')+'<br>'+pData['pairing'][6]+'<br><br>'+pData['pairing'][7]
            '''

@app.route('/invalid_<text>')
def errorPage(text):
    return flask.render_template('errorpage.html', text=text)


def addlog(logInfo):
    os.system("echo {} >> {}".format(logInfo, logFile))
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
    app.run(host='128.193.38.37', port=8080)#, debug=True)  # linearfoldtest.eecs.oregonstate.edu
    #app.run(host='0.0.0.0', port=8080)# , debug=True)
    #app.run(host='0.0.0.0') #, debug=True)
    #app.run(debug=True)
    #app.run()
