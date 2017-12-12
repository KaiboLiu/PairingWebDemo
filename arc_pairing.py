#!/usr/bin/env python

'''
Developer: Kaibo(lrushx)
Email: liukaib@oregonstate.edu
Process Time: Dec 08, 2017
 */
'''

'''
# read from "combine_16s.seq0*", use line 1 as seq, line 3 as ref/ref, line 5 as cf, line 7 as vn, line(8i+3) as linearcf, line(8i+7) as linearvf (start from line 0)
# to compose 4 circle graphs, we need to compare 4 sets(cf:ref, vn:ref,Lcf:ref,Lvn:ref)
'''

'''
In the saved data file, .seq03 for example, there are 1656 lines(seq *2 + ref *2 + cf *2 + vn *2 + linearcf *206*4 + lineavnf *206*4)
The structure of the file is:
seq * 2 lines               ----->  L1
ref * 2 lines               ----->  L3
cf  * 2 lines               ----->  L5
vn  * 2 lines               ----->  L7
linearcf.beam001 * 4 lines  ----->  L11 (with 2 lines of information above)
lineavnf.beam001 * 4 lines  ----->  L16 (with 2 lines of information above)
linearcf.beam002 * 4 lines
lineavnf.beam002 * 4 lines
linearcf.beam00i * 4 lines  ----->  L(8*i+3) (with 2 lines of information above), if i > 200, L[(i/100+198)*8+3]
lineavnf.beam00i * 4 lines  ----->  L(8*i+7) (with 2 lines of information above), if i > 200, L[(i/100+198)*8+7]
'''

import numpy as np
import sys
import operator
import pdb
import os

MAXLEN = 5650
MINLEN = 0
circular = True


def LoadData():
    RNAtype = "23s"
    dataDir = "./rearranged_results/"
    dataFile = "combine_"+RNAtype+".seq"
    beamDir1= dataDir+"linearcontrafold/run_"+RNAtype+"/log.LinearContrafold."+RNAtype+".beam"
    beamDir2= dataDir+"linearvienna/run_"+RNAtype+"/log.linearvienna."+RNAtype+".beam"
    outDir  = "./pairing_for_js/"

    if not os.path.exists(outDir):
        os.makedirs(outDir)
    
    seqNo = 5
    if (seqNo < 10):
        dataFile = dataFile + "0"
    dataFile = dataFile + str(seqNo)

    seq = []
    fileIn  = open(dataDir+dataFile)
    lines = fileIn.readlines();
    seq = lines[1][:-1]
    print(seq,len(seq))

    fileIn.close()



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
    lbs = ['(', '[', '{', '<']
    rbs = [')', ']', '}', '>']

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
            pairset.add((left,i))
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
    bases = [''] + list(seq)  



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
        color = "gray!20"
        missing.append((a,b))

    hit, wrong = [], []
    #extract pairs from pairs, compare with refpair
    for a, b, stackindex in pairs:
        if stackindex > 0:
            color = "red"
        else:
            if a in refpair and agree(respair, refpair, a):
                color = "green"
            elif b in refpair and agree(respair, refpair, b):
                color = "green"
            else:
                color = "red"
        if (color == "red"):
            wrong.append((a,b))
        else:
            hit.append((a,b))
    print hit


print("start")
LoadData()
print ("end")

#print >> logs, "%d out of %d sequences have pseudoknots" % (num_hasknot, index) #TODO
