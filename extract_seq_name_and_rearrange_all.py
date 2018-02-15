#!/usr/bin/env python

'''
Developer: Kaibo(lrushx)
Email: liukaib@oregonstate.edu
Process Time: Feb 14, 2018
 */
'''

'''
# run on ironcreek with the preset dirs
# for WebDemo in RNA project,
# original pairing structures are saved in different files by models and beams.
# now I need to find sequence names for the display in web demo.
# Sequence names are saved in ../RNA_visual_dengde/Mathews.clean.txt, which has 3857 sequence names and 11571 lines with seqs and refs.
'''

'''
# for WebDemo in RNA project,
# original pairing structures are saved in different files by models and beams.
# now I need to put all pairing results for a single seq into one file, 
  including ref, LinearContrafold, vienna, LinearContrafold beam001~800, LinearViennabeam001~800.
# These new data files will listed by seq number(16s * 22, and 23s *5, and grp_1 *96), 123 files in total.
# if the current seq is #i, the line position for pairing structure in ref, LinearContrafold, vienna are all i, 
  however the line position in LinearContrafold and LinearViennabeam is 7*i, information of time, score is in 7*i-3 and 7*i-2
'''
'''
In the saved data file, .seq03 for example, there are 1656 lines(seq *2 + ref *2 + cf *2 + vn *2 + linearcf *206*4 + lineavnf *206*4)
The structure of the file is:
seq * 2 lines               ----->  L1
ref * 2 lines               ----->  L3
cf  * 2 lines               ----->  L5
vn  * 2 lines               ----->  L7
linearcf.beam001 * 4 lines  ----->  L11 (with 2 lines of information above)
lineavnf.beam001 * 4 lines  ----->  L15 (with 2 lines of information above)
linearcf.beam002 * 4 lines
lineavnf.beam002 * 4 lines
...
linearcf.beam00i * 4 lines  ----->  L(8*i+3) (with 2 lines of information above), if i > 200, L[(i/100+198)*8+3]
lineavnf.beam00i * 4 lines  ----->  L(8*i+7) (with 2 lines of information above), if i > 200, L[(i/100+198)*8+7]
'''


import sys
import operator
import pdb
import os
import re
from collections import defaultdict


# family name will be extracted by seq

# local, my MacbookPro
#LineardataDir = "../RNA_visual_dengde/data_rest_families/run_allbeam_result/"
#contrafoldFile = "../RNA_visual_dengde/data_rest_families/log.Mathewsdata_contrafold_nosharpturn"
#viennaFile = "../RNA_visual_dengde/data_rest_families/log.Mathewsdata_vienna_withmodelscore"
#namePoolFile = "../RNA_visual_dengde/Mathews.clean.txt"

# server, ironcreek
LineardataDir = "/scratch/dengde/fastdecode/run_allbeam/run_allbeam_result/"
contrafoldFile = "../data_rest_families/log.Mathewsdata_contrafold_nosharpturn"
viennaFile = "../data_rest_families/log.Mathewsdata_vienna_withmodelscore"
namePoolFile = "../data_rest_families/Mathews.clean.txt"

nameDir  = "./seqName_all/"
outDir  = "./demo_rearranged_results_all/"


def LoadNames_rearrange():

    beam_list, tmp = range(1,201), range(300,801,100)
    beam_list[len(beam_list):len(beam_list)] = tmp

    if os.path.exists(nameDir):
        os.system('rm -rf '+nameDir)
    os.makedirs(nameDir)
    
    if os.path.exists(outDir):
        os.system('rm -rf '+outDir)
    os.makedirs(outDir)


    fileIn  = open(namePoolFile)
    namePool = fileIn.readlines()    # the last char in namePool[i] is '\n'        
    fileIn.close()

    fileIn  = open(LineardataDir+"LinearFoldC_beam001")    
    #fileIn  = open(contrafoldFile)
    seqs = fileIn.readlines()        # the last char in seqs[i] is '\n'        
    fileIn.close()


    d, list_family = defaultdict(int), []
    for i,line in enumerate(seqs):
        # in linear data file
        if line == 'seq:\n':
            seq = seqs[i+1]
            '''
        # in contrafoldfile
        if line == '>structure\n':
            seq, strc = seqs[i-1], seqs[i+1]
            '''
            pos = namePool.index(seq)
            pattern_len     = '\s(\d+)'
            pattern_family  = 'archiveII/([^_]+)'
            pattern_name    = '_([\w._-]+).ct$'
                        # pos-1: 1 1492 archiveII/16s_A.fulgidus.ct
                        # pos:   seq
                        # pos+1: ref                      
            str_family = re.findall(pattern_family, namePool[pos-1])[0]
            str_name = re.findall(pattern_name, namePool[pos-1])[0]
            str_len = re.findall(pattern_len, namePool[pos-1])[0]

            ref = namePool[pos+1]
            j = d[str_family]
            if j == 0: 
                #print(str_family )
                list_family.append(str_family)
            d[str_family] += 1

            index = str(j)
            if j < 10:    index = '0' + index
            if j < 100:   index = '0' + index
            if j < 1000:  index = '0' + index
            html_line = '<option data-c1="' + str_family + '" value="'+index+'">seq'+index+': '+str_name+' (len:'+str_len+')</option>\n'
            # <option data-c1="Group I Intron" value="26">seq26: a.I1.e.B.ciliata.JCM6865.C1.SSU.1506 (len:357)</option>
            
            f = open(nameDir+"seqNames_for_html."+str_family,"a")
            f.write(html_line)		# 0000-1283
            f.close()

            f = open(nameDir+"seqNames."+str_family,"a")
            f.write('seq'+index+': '+str_name+'\n')      # 0000-1283
            f.close()

 ## start to rearrange
            outFile = "combine_"+str_family+".seq"+index
            f = open(outDir+outFile,'a')
            f.write(">>>>>>seq\n"+seq+">>>>>>ref\n"+ref)

            #f.write(">>>>>>seq\n"+seq[i]+">>>>>>ref\n"+ref[i]+">>>>>>contrafold\n"+cf[7*i+6]+">>>>>>vienna\n"+vn[7*i+6])
            fileIn  = open(contrafoldFile)
            cfs = fileIn.readlines()    # the last char in namePool[i] is '\n'        
            fileIn.close()
            cf = cfs[cfs.index(seq)+2]
            f.write(">>>>>>contrafold\n"+cf)            

            fileIn  = open(viennaFile)
            vns = fileIn.readlines()    # the last char in namePool[i] is '\n'
            fileIn.close()            
            vn = vns[vns.index(seq)+1]
            pattern_v = '^(\S+)'
            vn = re.findall(pattern_v,vn)[0]
            f.write(">>>>>>vienna\n"+vn+"\n")

            for beam in beam_list:
                str_beam = str(beam)
                if beam < 100: str_beam = '0' + str_beam
                if beam < 10:  str_beam = '0' + str_beam
            
                fileIn  = open(LineardataDir+'LinearFoldC_beam'+str_beam)
                lcs = fileIn.readlines()    # the last char in namePool[i] is '\n'
                fileIn.close()
                pos = lcs.index(seq)+1
                f.write(">>>>>>LinearFoldC.beam"+str_beam+"\n"+lcs[pos]+lcs[pos+1]+lcs[pos+3])

                fileIn  = open(LineardataDir+'LinearFoldV_beam'+str_beam)
                lvs = fileIn.readlines()    # the last char in namePool[i] is '\n'
                fileIn.close()
                pos = lvs.index(seq)+1
                f.write(">>>>>>LinearFoldV.beam"+str_beam+"\n"+lvs[pos]+lvs[pos+1]+lvs[pos+3])
            f.close()

    for str_family in list_family:
        print(str_family+': %d'%(d[str_family]))


def RunMain():
    print("start")
    LoadNames_rearrange()

if __name__ == "__main__":
    RunMain()
