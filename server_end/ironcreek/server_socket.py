
#!/usr/bin/python
# -*- coding: UTF-8 -*-
# server_socket.py

import time
import os
import socket               # import socket module
import arc_pairing_single_json

s = socket.socket()         # creat socket object
host = socket.gethostname() # get local host name
port = 11113                # set port
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

LD = "export CXX=/usr/local/common/gcc-4.9.0/bin/g++; export CC=/usr/local/common/gcc-4.9.0/bin/gcc; export LD_LIBRARY_PATH=/usr/local/common/gcc-4.9.0/lib64"
s.listen(5)                 # wait for users's connect
while True:
    c, addr = s.accept()     # built connection
    inFileName = c.recv(1024)

    inFile = usrDir+inFileName                          # input path
    print 'input file located at'+inFile
    print time.asctime()+', client address', addr
    #c.send('Hello world, it\'s Kaibo, from server: %s: %s\nYour address is: %s' %(host, port, addr))
    time0 = time.time()
    outLc = outDir + inFileName + '.lc.res'             # output path for linearFold-C
    outLv = outDir + inFileName + '.lv.res'             # output path for linearFold-V
    outPairPath = outDir + inFileName + '.pairing.res'  # output path for pairing result 

    fileIn  = open(inFile)                              # read seq information from input 
    usrData = fileIn.readlines();
    seqName = usrData[0][:-1]
    seq = usrData[1][:-1]
    beamsize = int(usrData[2])
    fileIn.close()

    tmpSeqFile = tmpDir + 'test0.seq'
    os.system("echo %s > %s" % (seq, tmpSeqFile))    # save seq to the file for running in linearFold programs

    # do the linearfold-c
    time_s = time.time()
    os.system("/scratch/dengde/fastdecode/fastcky_rerun/build_beamckypar/beamckypar -f {} -b {} > {}".format(tmpSeqFile, beamsize, outLc) ) ## linearfold-c
    time1 = time.time() - time_s

    # do the linearfold-v
    time_s = time.time()
    os.system("{}; /scratch/dengde/fastdecode/fastcky_vienna/fastcky/build/beamckypar -f {} -b {} > {}".format(LD, tmpSeqFile, beamsize, outLv) ) ## linearfold-v
    time2 = time.time() - time_s
    '''  # non-linear series(contrafold and vienna)
    time_s = time.time()
    os.system("/scratch/dengde/fastdecode/fastcky_rerun/contrafold/contrafold predict  --params /scratch/dengde/fastdecode/fastcky/contrafold/contrafold.params.complementary --viterbi %s >  %s"  % (inFile, outFile+'.cf.res' ) ) ## contrafold
    time3 = time.time() - time_s   

    time_s = time.time()
    os.system("echo %s | /scratch/dengde/vienna/ViennaRNA-2.2.7/src/bin/RNAfold > %s" %(seq, outFile+'.vn.res') ) ## vienna
    time4 = time.time() - time_s
    '''
    f_lc = open(outLc)
    f_lv = open(outLv)
    #f_cf = open(outFile+'.cf.res')
    #f_vn = open(outFile+'.vn.res')

    lc = f_lc.readlines()
    lv = f_lv.readlines()
    f_lc.close()
    f_lv.close()


    arc_pairing_single_json.LoadSave(outPairPath,seq,lc[6][:-1],lv[6][:-1],time1,time2,beamsize,seqName)
    c.send('output to %s' %(outPairPath)+\
            '\n>> linearFold-C\n'+ lc[-1] + 'total process time: %f' %(time1)+\
            '\n>> linearFold-V\n'+ lv[-1] + 'total process time: %f' %(time2))#+\
    #       '\n>> cf\n'+ f_cf.readlines()[-1] + 'total process time: %f' %(time3)+\
    #       '\n>> vn\n'+ f_vn.readlines()[-1] + 'total process time: %f' %(time4))
    #os.system("rm -f {}".format(inFile))
    #os.system("rm -f "+outLc)
    #os.system("rm -f "+outLv)
    #os.system("cp -f %s %s" % (outPairPath, outDir+'pairing.res'))
    #f_cf.close()
    #f_vn.close()
    
    #os.system("echo [%s] len: %d, time: %0.5f, file: %s >> %s" %(time.asctime(), len(seq) , time1+time2, inFileName, logFile))
    #os.system("echo [{0}] [len: {1:0>7}] [time: {2:0>12.5f}s] [file: {3}] >> {4}".format(time.asctime(), len(seq) , time1+time2, inFileName, logFile))
    c.send("[{0}] [len: {1:0>7}] [time: {2:0>12.5f}s] [file: {3}]".format(time.asctime(), len(seq) , time1+time2, inFileName))
    #os.system("cp %s %s" %(logFile, logFile2))
    c.close()                # close connection

