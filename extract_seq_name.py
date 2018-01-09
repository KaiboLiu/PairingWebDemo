#!/usr/bin/env python

'''
Developer: Kaibo(lrushx)
Email: liukaib@oregonstate.edu
Process Time: Jan 09, 2018
 */
'''

'''
# for WebDemo in RNA project,
# original pairing structures are saved in different files by models and beams.
# now I need to find sequence names for the display in web demo.
# Sequence names are saved in ../RNA_visual_dengde/Mathews.clean.txt, which has 3857 sequence names and 11571 lines with seqs and refs.
'''


import sys
import operator
import pdb
import os

def LoadData():
	RNAtype = "grp1"			# either 16s, 23s, or grp1
	dataDir = "../RNA_visual_dengde/"
	namePoolFile = "Mathews.clean.txt"
	seqFile = "Mathewsdata."+RNAtype+".seq"

	outDir  = "./seqName/"
	outFile = "seqNames."+RNAtype

	if not os.path.exists(outDir):
		os.makedirs(outDir)
	
	fileIn  = open(dataDir+namePoolFile)
	namePool = fileIn.readlines()	# the last char in namePool[i] is '\n'		
	fileIn.close()

	fileIn  = open(dataDir+seqFile)
	seqs = fileIn.readlines()		# the last char in seqs[i] is '\n'		
	fileIn.close()
	
	f = open(outDir+outFile,"w")

	for i,seq in enumerate(seqs):
		pos = namePool.index(seq)
		f.write('seq')
		if (i < 10):
			f.write('0')
		f.write(str(i)+': '+namePool[pos-1])
	f.close()




def RunMain():
	print("start")
	LoadData()

if __name__ == "__main__":
    RunMain()
