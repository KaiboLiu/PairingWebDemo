
#!/usr/bin/python
# -*- coding: UTF-8 -*-
# server_socket.py

import time
import os
import socket               # import socket module
import arc_pairing_single_json

s = socket.socket()         # creat socket object
host = socket.gethostname() # get local host name
port = 11110                # set port
s.bind((host, port))        # bind port


#usrFile = "uploaded1.txt"
usrDir  = "/nfs/stak/users/liukaib/public_html/usrData/"
tmpDir = "./tmp/"
outDir = "/nfs/stak/users/liukaib/public_html/demo_data_run/"

#logFile = "/nfs/stak/users/liukaib/public_html/demo_data_run/usrLog.txt" 
#logFile2 = "./usrLog.txt"

if not os.path.exists(tmpDir):
    os.makedirs(tmpDir)


beamsize = 100
s.listen(5)
while True:
    c, addr = s.accept()     # built connection
    inFileName = c.recv(1024)

    inFile = usrDir+inFileName                          # input path
    print 'input file located at'+inFile
    print time.asctime()+', client address', addr
    #c.send('Hello world, it\'s Kaibo, from server: %s: %s\nYour address is: %s' %(host, port, addr))
    time0 = time.time()
    outLc = outDir + inFileName + '.lc.res'             # output path for linearFold-C
    outPairPath = outDir + inFileName + '.pairing.res'  # output path for pairing result 

    fileIn  = open(inFile)                              # read seq information from input 
    usrData = fileIn.readlines();
    seqName = usrData[0][:-1]
    seq = usrData[1][:-1]
    beamsize = int(usrData[2])
    fileIn.close()

    tmpSeqFile = tmpDir + 'test1.seq'
    os.system("echo %s > %s" % (seq, tmpSeqFile))    # save seq to the file for running in linearFold programs

    # do the linearfold-c
    time_s = time.time()
    os.system("/scratch/dengde/fastdecode/fastcky_rerun/build_beamckypar/beamckypar -f {} -b {} > {}".format(tmpSeqFile, beamsize, outLc) ) ## linearfold-c
    time1 = time.time() - time_s
    c.send(str(time1))
    c.close()                # close connection

