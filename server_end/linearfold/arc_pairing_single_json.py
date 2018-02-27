#!/usr/bin/env python

'''
Developer: Kaibo(lrushx)
Email: liukaib@oregonstate.edu
Process Time: Jan 29, 2018
 */
'''

'''
# given the seq, and predicted strucure lc, lv, pairing the RNA without gold, dump length, seq, lc,lv, pairing_lc, pairing_lv into a file
'''

'''
save pairing results into file as json format:
{"result":[N,beam_size, time_lc,time_lv, seqName, seq, lc,lv                     ----->index: 0-7
            [P,R,F],linearcf_missing[...], linearcf_hit[], linearcf_wrong[],     ----->index: 8-11
            [P,R,F],linearvn_missing[...], linearvn_hit[], linearvn_wrong[],     ----->index: 12-15
        ]}
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
#lbs = ['('] # pseudoknot-free only, even for grey part
#rbs = [')'] # pseudoknot-free only, even for grey part 

def LoadSave(outFile,seq,lc,lv,t1,t2,beam,name,score1,score2):
    
    data = []

    data = [len(seq), beam, t1, t2, name]
    data.append(seq)
    data.append(lc)
    data.append(lv)
    '''
    P_R_F_missing_hit_wrong = pairing(seq,ref,cf)     # pairing cf and compare with ref
    data[len(data):len(data)] = P_R_F_missing_hit_wrong

    P_R_F_missing_hit_wrong = pairing(seq,ref,vn)     # pairing vn and compare with ref
    data[len(data):len(data)] = P_R_F_missing_hit_wrong
    '''

    P_R_F_missing_hit_wrong1,P_R_F_missing_hit_wrong2  = pairing(lc, lv, score1, score2)     # pairing linearcf and linearvn    
    data[len(data):len(data)] = P_R_F_missing_hit_wrong1
    data[len(data):len(data)] = P_R_F_missing_hit_wrong2
    #print P_R_F_missing_hit_wrong1,P_R_F_missing_hit_wrong2
    '''
    P_R_F_missing_hit_wrong = pairing(lc, score1)     # pairing linearcf
    data[len(data):len(data)] = P_R_F_missing_hit_wrong
    
    P_R_F_missing_hit_wrong = pairing(lv, score2)     # pairing linearvn
    data[len(data):len(data)] = P_R_F_missing_hit_wrong
    '''
    with open(outFile,'w') as f:
        json.dump({"pairing":data}, f, ensure_ascii=False)

    f.close()
    

def agree(pres, pref, a, b): ## pres[a] = b
    if pref[a] == b:
        return True
    elif pref.get(a-1,-1) == b or pref.get(a+1,-1) == b:
        return True
    elif pref.get(b-1,-1) == a or pref.get(b+1,-1) == a:
        return True
    else:
        return False

def showRrefFamlies(ref):
    stacks, ref_pair = [], []
    for _ in xrange(len(lbs)):
        stacks.append([])
        ref_pair.append([])
    for i, item in enumerate(ref):
        if item in lbs:
            stackindex = lbs.index(item)
            stacks[stackindex].append(i)
        elif item in rbs:
            stackindex = rbs.index(item)
            j = stacks[stackindex].pop()
            ref_pair[stackindex].append(j)
            ref_pair[stackindex].append(i)
    while ref_pair and ref_pair[-1] == []:
        ref_pair.pop()
    return ref_pair

def pairing(res,ref,score1,score2):
    #brackets for pseudoknot
    pairs = []
    refpairs = []
    respair = defaultdict(lambda: -1)
    refpair = defaultdict(lambda: -1)    

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

    length = len(ref)

    missing = []
    #extract pairs from refpairs, compare with respair
    for a, b, stackindex in refpairs:
        if agree(refpair, respair, a, b):
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
            if agree(respair, refpair, a, b):
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
    precision = 0 
    recall = 0 
    #return [[precision,recall,score1], [], hit, wrong], [[precision,recall,score2], [], hit, missing]
    return [[precision,recall,score1], [], hit, wrong], [[precision,recall,score2], missing, hit, []]

'''
## pairing by self, no gold
def pairing(res,score):
    #brackets for pseudoknot

    pairs = []
    respair = defaultdict(lambda: -1)
    missing, hit, wrong = [], [], []
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
            missing.append(left)
            missing.append(i)


    precision = 0
    recall = 0
    Fscore = score 
    return [[precision,recall,Fscore], missing, hit, wrong]


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
        if agree(refpair, respair, a, b):
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
            if agree(respair, refpair, a, b):
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
    precision = round(len(hit)/2.0/len(pairs),4)
    recall = round(len(hit)/2.0/len(refpairs),4)
    Fscore = 0
    if (len(hit) > 0):
        Fscore = round(2*precision*recall/(precision+recall),4)
    return [[precision,recall,Fscore], missing, hit, wrong]

    '''
'''
print("start")
for seq_No in xrange(22):      # xrange(22) if seq is 16s, xrange(5) if seq is 23s, xrange(96) if seq is grp1
    LoadSave("16s",seq_No)
    print("finish seq %d" %(seq_No))
print ("end")
'''
#print >> logs, "%d out of %d sequences have pseudoknots" % (num_hasknot, index) #TODO
