#!/usr/bin/env python

'''
Developer: Kaibo(lrushx)
Email: liukaib@oregonstate.edu
Process Time: Dec 14, 2017
 */
'''

'''
# read from "combine_16s.seq0*", use line 1 as seq, line 3 as ref/ref, line 5 as cf, line 7 as vn, line(8i+3) as linearcf, line(8i+7) as linearvf (start from line 0)
# to compose 4 circle graphs, we need to compare 4 sets(cf:ref, vn:ref,Lcf:ref,Lvn:ref)
'''

'''
In the saved data file, .seq03 for example, there are 1656 lines(seq *2 + ref *2 + cf *2 + vn *2 + linearcf *206*4 + lineavnf *206*4)
The structure of the file is:
seq * 2 lines               ----->  L1 (L0 is '>>>>>>seq' )
ref * 2 lines               ----->  L3
cf  * 2 lines               ----->  L5
vn  * 2 lines               ----->  L7
linearcf.beam001 * 4 lines  ----->  L11 (with 2 lines of information above)
lineavnf.beam001 * 4 lines  ----->  L15 (with 2 lines of information above)
linearcf.beam002 * 4 lines
lineavnf.beam002 * 4 lines
linearcf.beam00i * 4 lines  ----->  L(8*i+3) (with 2 lines of information above), if i > 200, L[(i/100+198)*8+3]
lineavnf.beam00i * 4 lines  ----->  L(8*i+7) (with 2 lines of information above), if i > 200, L[(i/100+198)*8+7]
'''

'''
save pairing results into file as json format:
{"result":[N,seq,                                                           ----->index: 0-1
            cf_missing, cf_hit, cf_wrong,                                   ----->index: 2-4
            vn_missing, vn_hit, vn_wrong,                                   ----->index: 5-7
            linearcf_b01_missing, linearcf_b01_hit, linearcf_b01_wrong,     ----->index: 8-10
            linearvn_b01_missing, linearvn_b01_hit, linearvn_b01_wrong,     ----->index: 11-13
            linearcf_b02_missing, linearcf_b02_hit, linearcf_b02_wrong,     ----->index: 14-16 (6*i+2~6*i+4,i is the beam number)
            linearvn_b02_missing, linearvn_b02_hit, linearvn_b02_wrong,     ----->index: 17-19 (6*i+5~6*i+7,i is the beam number)
            ...
            linearcf_b800_missing, linearcf_b800_hit, linearcf_b800_wrong,  ----->index: 1238-1240 [(i/100+198)*6+2~(i/100+198)*6+5,i is the beam number which is > 200]
            linearvn_b800_missing, linearvn_b800_hit, linearvn_b800_wrong,  ----->index: 1241-1243 [(i/100+198)*6+5~(i/100+198)*6+7,i is the beam number which is > 200]

             ]}
The new pairing data files will listed by seq number(16s * 22, and 23s *5), 27 files in total.
'''

import sys
import operator
import pdb
import os
from collections import defaultdict
import json
logs = sys.stderr

MAXLEN = 5650
MINLEN = 0
circular = True

lbs = ['(', '[', '{', '<']
rbs = [')', ']', '}', '>']

def LoadSave(RNAtype,seqNo):
    #RNAtype = "16s"
    #seqNo = 5

    dataDir  = "./rearranged_results/"
    dataFile = "combine_"+RNAtype+".seq"
    outDir   = "./pairing_for_js/"
    outFile  = "combine_pairing_"+RNAtype+".seq"
    number   = str(seqNo)
    if (seqNo < 10):
        number = "0" + number

    if not os.path.exists(outDir):
        os.makedirs(outDir)
    
    data = []
    fileIn  = open(dataDir+dataFile+number)
    lines = fileIn.readlines();
    seq = lines[1][:-1]
    ref = lines[3][:-1]
    cf  = lines[5][:-1]
    vn  = lines[7][:-1]



    data = [len(seq)]
    data.append(seq)
    #f.write("%s\n" %len(seq))
    #f.write(lines[1])
    #f.write(">>>>>>contrafold (missing/ hit/ wrong pairs)\n")
    missing_hit_wrong = pairing(seq,ref,cf)     # pairing cf and compare with ref
    data[len(data):len(data)] = missing_hit_wrong

    missing_hit_wrong = pairing(seq,ref,vn)     # pairing vn and compare with ref
    data[len(data):len(data)] = missing_hit_wrong

    #       beam_list = range(1,201) + range(300,801,100)
    n_line = len(lines)
    for i in xrange(11,n_line,8):
        linearcf_beam_i = lines[i][:-1]
        missing_hit_wrong = pairing(seq,ref,linearcf_beam_i)     # pairing linearcf_beam_i and compare with ref
        data[len(data):len(data)] = missing_hit_wrong
        
        linearvn_beam_i = lines[i+4][:-1] 
        missing_hit_wrong = pairing(seq,ref,linearvn_beam_i)     # pairing linearcf_beam_i and compare with ref
        data[len(data):len(data)] = missing_hit_wrong

    fileIn.close()

    with open(outDir+outFile+number,'w') as f:
        json.dump({"pairing":data}, f, ensure_ascii=False)


    '''
    #save by line as plaintext
    f = open(outDir+outFile+number,'w')
    f.write("%s\n" %len(seq))
    f.write(">>>>>>contrafold (missing/ hit/ wrong pairs)\n")
    missing, hit, wrong = pairing(seq,ref,cf)
    for pos in missing:
        f.write("%s " % pos)
    f.write("\n")

    for pos in hit:
        f.write("%s " % pos)
    f.write("\n")

    for pos in wrong:
        f.write("%s " % pos)
    f.write("\n")
    
    f.write(missing)
    f.write(hit)
    f.write(wrong)
    
    
    #f.write(">>>>>>vienna(missing, hit, wrong pairs)\n")
    #missing, hit, wrong = pairing(seq,ref,cf)


    #f.write(">>>>>>LinearContrafold"+beamFile1[-8:]+"\n")
    '''
    f.close()
    



def agree(pres, pref, index):
    if pres[index] == pref[index]:
        return True
    elif pres[index-1] == pref[index] and pref[index] != -1:
        return True
    elif pres[index+1] == pref[index] and pref[index] != -1:
        return True
    elif pres[index] == pref[index-1] and pres[index] != -1:
        return True
    elif pres[index] == pref[index+1] and pres[index] != -1:
        return True
    else:
        return False



def pairing(seq,ref,res):
    #brackets for pseudoknot
    pairs = []
    refpairs = []
    respair = defaultdict(lambda: -1)
    refpair = defaultdict(lambda: -1)    

    notes = ""
    #pairing in result
    stacks = []
    for _ in xrange(len(lbs)):
        stacks.append([])
    for i, item in enumerate(res):
        if item in lbs:
            stackindex = lbs.index(item)
            stacks[stackindex].append(i)
        elif item in rbs:
            stackindex = rbs.index(item)
            left = stacks[stackindex][-1]
            stacks[stackindex] = stacks[stackindex][:-1]    # stacks[stackindex].pop() ?
            pairs.append((left,i, stackindex))
            respair[left] = i
            respair[i] = left
    notes += ";pair=%d" % (len(respair)//2)  


    #pairing in ref
    stacks = []
    for _ in xrange(len(lbs)):
        stacks.append([])
    for i, item in enumerate(ref):
        if item in lbs:
            stackindex = lbs.index(item)
            stacks[stackindex].append(i)
        elif item in rbs:
            stackindex = rbs.index(item)
            left = stacks[stackindex][-1]
            stacks[stackindex] = stacks[stackindex][:-1]
            refpairs.append((left,i, stackindex))
            refpair[left] = i
            refpair[i] = left

    length = len(seq)

    missing = []
    #extract pairs from refpairs, compare with respair
    for a, b, stackindex in refpairs:
        if a in respair and agree(respair, refpair, a):
            ifdraw = False
        elif b in respair and agree(respair, refpair, b):
            ifdraw = False
        else:
            ifdraw = True

        if not ifdraw:
            continue
        #color = "gray!20"
        #missing.append((a,b))
        missing.append(a)
        missing.append(b)

    hit, wrong = [], []
    #extract pairs from pairs, compare with refpair
    for a, b, stackindex in pairs:
        if stackindex > 0:
            color = "wrong"
        else:
            if a in refpair and agree(respair, refpair, a):
                color = hit
            elif b in refpair and agree(respair, refpair, b):
                color = "hit"
            else:
                color = "wrong"
        if (color == "wrong"):
            wrong.append(a)
            wrong.append(b)
            #wrong.append((a,b))
        else:
            hit.append(a)
            hit.append(b)
    #print hit
    #print "-------"
    #print wrong

    return [missing, hit, wrong]



print("start")
for seq_No in xrange(1,6):      # xrange(1,23) if seq is 16s, xrange(1,6) if seq is 23s
    LoadSave("23s",seq_No)
    print("finish seq %d" %(seq_No))
print ("end")

#print >> logs, "%d out of %d sequences have pseudoknots" % (num_hasknot, index) #TODO
