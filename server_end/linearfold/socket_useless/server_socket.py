
#!/usr/bin/python
# -*- coding: UTF-8 -*-
# server_socket.py

import time
import os
import socket               # import socket module
from arc_pairing_single_json import LoadSave

s = socket.socket()         # creat socket object
host = socket.gethostname() # get local host name
port = 11113                # set port
s.bind((host, port))        # bind port


usrFile = "uploaded1.txt"
tmpDir = "./tmp_result/"
usrDir  = "/nfs/stak/users/liukaib/public_html/usrData/"
outDir = '/nfs/stak/users/liukaib/public_html/demo_data_run/'

if not os.path.exists(tmpDir):
    os.makedirs(tmpDir)

fileIn  = open(usrDir+usrFile)
usrData = fileIn.readlines();
seqName = usrData[0][:-1]
seq = usrData[1][:-1]
fileIn.close()

#seqName = 'NewName'
#seq = 'UAAGGCAGUGGUAGCGCUGAAGAAUGUUCGUGCAAUUGUCGUUAUUCAUUAUAAAAGGGCGGGUUUUAAAGGAUAUUUUAAAAUUUAAAACAAGCUUUUAAGAGCAGAUGGCGGAUGCCUUGCCAAAGAGAGGCGAUGAAGGACGUACUAGACUGCGAUAAGCUAUGCGGAGCUGUCAAGGAGCUUUGAUGCGUAGAUGUCCGAAUGGGGCAACCCAACUAAUAGAGAUAUUAGUUACUCUAACAGAGAGCGAACCUAGUGAAGUGAAACAUCUCAGUAACUAGAGGAAAAGAAAUCAACGAGAUUCCCUAAGUAGUGGCGAGCGAACGGGGAAAAGGGCAAACCGAGUGCUUGCAUUCGGGGUUGAGGACUGCAACAUCCAAGAGAACGCUUUAGCAGAGUUACCUGGAAAGGUAAGCCAUAGAAAGUGAUAGCCUUGUAUGCGACAAGGCGUUUUUAGGUAGCAGUAUCCAGAGUAGGCCAGGACACGAGGAAUCCAGGUUGAAGCCGGGGAGACCACUCUCCAACUCUAAAUACUACUCUUUGAGCGAUAGCGAACAAGUACCGUGAGGGAAAGGUGAAAAGAACCGCAGUGAGCGGAGUGAAAUAGAACCUGAAACCAUCUGCUUACAAUCAUUCAGAGCCCUAUGAUUUAUCAGGGUGAUGGACUGCCUUUUGCAUAAUGAUCCUGCGAGUUGUGGUAUCUGGCAAGGUUAAGCGAAUGCGAAGCCGUAGCGAAACGAGUUCUUAAUAGGGCGAACAAGUCAGAUGCUGCAGACCCGAAGCUAAGUGAUCUAUCCAUGGCCAAGUUGAAACGCGUGUAAUAGCGCGUGGAGGACUGAACUCCUACCCAUUGAAACGGGUUGGGAUGAGCUGUGGAUAGGGGUGAAAGGCCAAACAAACUUAGUGAUAGCUGGUUCUCUUCGAAAUAUAUUUAGGUAUAGCCUCAAGUGAUAAUAAAAGGGGGUAGAGCGCUGAUUGGGCUAGGGCUGCUCGCCGCGGUACCAAACCCUAUCAAACUUCGAAUACCUUUUAUCGUAUCUUGGGAGUCAGGCGGUGGGUGAUAAAAUCAAUCGUCAAAAGGGGAACAACCCAGACUACCAAAUAAGGUCCCUAAGUUCUAUUCUGAGUGGAAAAAGAUGUGUGGCUACUAAAACAACCAGGAGGUUGGCUUAGAAGCAGCCAUCCUUUAAAGAAAGCGUAACAGCUCACUGGUCUAGUGGUCAUGCGCUGAAAAUAUAACGGGGCUAAGAUAGACACCGAAUUUGUAGAUUGUGUUAAACACAGUGGUAGAAGAGCGUUCAUACCAGCGUUGAAGGUAUACCGGUAAGGAGUGCUGGAGCGGUAUGAAGUGAGCAUGCAGGAAUGAGUAACGAUAAGAUAUAUGAGAAUUGUAUCCGCCGUAAAUCUAAGGUUUCCUACGCGAUGGUCGUCAUCGUAGGGUUAGUCGGGUCCUAAGCCGAGUCCGAAAGGGGUAGGUGAUGGCAAAUUGGUUAAUAUUCCAAUACCGACUGUGGAGCGUGAUGGGGGGACGCAUAGGGUUAAGCGAGCUAGCUGAUGGAAGCGCUAGUCUAAGGGCGUAGAUUGGAGGGAAGGCAAAUCCACCUCUGUAUUUGAAACCCAAACAGGCUCUUUGAGUCCUUUUAGGACAAAGGGAGAAUCGCUGAUACCGUCGUGCCAAGAAAAGCCUCUAAGCAUAUCCAUAGUCGUCCGUACCGCAAACCGACACAGGUAGAUGAGAUGAGUAUUCUAAGGCGCGUGAAAGAACUCUGGUUAAGGAACUCUGCAAACUAGCACCGUAAGUUCGCGAUAAGGUGUGCCACAGCGAUGUGGUCUCAGCAAAGAGUCCCUCCCGACUGUUUACCAAAAACACAGCACUUUGCCAACUCGUAAGAGGAAGUAUAAGGUGUGACGCCUGCCCGGUGCUCGAAGGUUAAGAGGAUGCGUCAGUCGCAAGAUGAAGCGUUGAAUUGAAGCCCGAGUAAACGGCGGCCGUAACUAUAACGGUCCUAAGGUAGCGAAAUUCCUUGUCGGUUAAAUACCGACCUGCAUGAAUGGCGUAACGAGAUGGGAGCUGUCUCAACCAGAGAUUCAGUGAAAUUGUAGUGGAGGUGAAAAUUCCUCCUACCCGCGGCAAGACGGAAAGACCCCGUGGACCUUUACUACAACUUAGCACUGCUAAUGGGAAUAUCAUGCGCAGGAUAGGUGGGAGGCUUUGAAGUAAGGGCUUUGGCUCUUAUGGAGUCAUCCUUGAGAUACCACCCUUGAUGUUUCUGUUAGCUAACUGGCCUGUGUUAUCCACAGGCAGGACAAUGCUUGGUGGGUAGUUUGACUGGGGCGGUCGCUCCUAAAAAGUAACGGAGGCUUGCAAAGGUUGGCUCAUUGCGGUUGGAAAUCGCAAGUUGAGUGUAAUGGCACAAGCCAGCCUGACUGUAAGACAUACAAGUCAAGCAGAGACGAAAGUCGGUCAUAGUGAUCCGGUGGUUCUGUGUGGAAGGGCCAUCGCUCAAAGGAUAAAAGGUACCCCGGGGAUAACAGGCUGAUCUCCCCCAAGAGCUCACAUCGACGGGGAGGUUUGGCACCUCGAUGUCGGCUCAUCGCAUCCUGGGGCUGGAGCAGGUCCCAAGGGUAUGGCUGUUCGCCAUUUAAAGCGGUACGCGAGCUGGGUUCAGAACGUCGUGAGACAGUUCGGUCCCUAUCUGCCGUGGGCGUAGGAAAGUUGAGGAGAGCUGUCCCUAGUACGAGAGGACCGGGAUGGACGUGUCACUGGUGCACCAGUUGUCUGCCAAGAGCAUCGCUGGGUAGCACACACGGAUGUGAUAACUGCUGAAAGCAUCUAAGCAGGAACCAACUCCAAGAUAAACUUUCCCUGAAGCUCGCACAAAGACUAUGUGCUUGAUAGGGUAGAUGUGUGAGCGCAGUAAUGCGUUUAGCUGACUACUACUAAUAGAGCGUUUGGCUUGUUUUU'

beamsize = 100

LD = "export CXX=/usr/local/common/gcc-4.9.0/bin/g++; export CC=/usr/local/common/gcc-4.9.0/bin/gcc; export LD_LIBRARY_PATH=/usr/local/common/gcc-4.9.0/lib64"
s.listen(5)                 # wait for users's connect
while True:
    c, addr = s.accept()     # built connection
    print 'client address', addr
    #c.send('Hello world, it\'s Kaibo, from server: %s: %s\nYour address is: %s' %(host, port, addr))
    time0 = time.time()
    outFile = tmpDir + str(time0)
    inFile  = outFile + '.test.seq'
    outLc = outFile + '.lc.res'
    outLv = outFile + '.lv.res'
    
    outPair = outDir + str(time0) + '.pairing.res'

    os.system("echo %s > %s;" % (seq, inFile))

    time_s = time.time()
    #os.system("echo %s > test2.seq; /scratch/dengde/fastdecode/fastcky_rerun/build_beamckypar/beamckypar -f test2.seq -b %d >  result_run/res.%d" % (seq, beamsize, cnt) ) ## linearfold-c
    os.system("/scratch/dengde/fastdecode/fastcky_rerun/build_beamckypar/beamckypar -f %s -b %d >  %s" % (inFile, beamsize, outLc) ) ## linearfold-c
    time1 = time.time() - time_s

    time_s = time.time()
    #os.system("%s; echo %s > test2.seq; /scratch/dengde/fastdecode/fastcky_vienna/fastcky/build/beamckypar -f test2.seq -b %d >  result_run/res.%d" % (LD, seq, beamsize, cnt) ) ## linearfold-v
    os.system("%s; /scratch/dengde/fastdecode/fastcky_vienna/fastcky/build/beamckypar -f %s -b %d >  %s" % (LD, inFile, beamsize, outLv) ) ## linearfold-v
    time2 = time.time() - time_s
    ''' 
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
    LoadSave(outPair,seq,lc[6][:-1],lv[6][:-1],time1,time2,beamsize,seqName)
    #os.system("cp %s ~/public_html/%s" %(outFile+".pairing.res", str(time0) + '.pairing.res'))
    c.send('output to %s' %(outPair)+\
            '\n>> lc\n'+ lc[-1] + 'total process time: %f' %(time1)+\
            '\n>> lv\n'+ lv[-1] + 'total process time: %f' %(time2))#+\
    #       '\n>> cf\n'+ f_cf.readlines()[-1] + 'total process time: %f' %(time3)+\
    #       '\n>> vn\n'+ f_vn.readlines()[-1] + 'total process time: %f' %(time4))
    f_lc.close()
    f_lv.close()
    os.system("rm -f "+inFile)
    os.system("rm -f "+outLc)
    os.system("rm -f "+outLv)
    os.system("cp -f %s %s" % (outPair, outDir+'pairing.res'))
    #os.system("cp -f %s %s" % (outPair, '/nfs/stak/users/liukaib/public_html/socket/pairing.res'))
    #f_cf.close()
    #f_vn.close()
    
    c.close()                # close connection

