#!/usr/bin/env python

'''
# for WebDemo in RNA project,
# original pairing structures are saved in different files by models and beams.
# now I need to put all pairing results for a single seq into one file, 
  including gold, LinearContrafold, vienna, LinearContrafold beam001~800, LinearViennabeam001~800.
# These new data files will listed by seq number(16s * 22, and 23s *5), 27 files in total.
# if the current seq is #i, the line position for pairing structure in gold, LinearContrafold, vienna are all i, 
  however the line position in LinearContrafold and LinearViennabeam is 7*i, information of time, score is in 7*i-3 and 7*i-2
# read a matrix, 5 columns, with 1~4 as 4 features and 5th as label.
'''


import numpy as np
import sys
import operator
import pdb
import os

def LoadData():
	RNAtype = "23s"
	dataDir = "../RNA_visual_dengde/"
	seqFile = "Mathewsdata."+RNAtype+".seq"
	refFile = "Mathewsdata."+RNAtype+".ref"
	cfFile  = "Mathewsdata."+RNAtype+".contrafoldres"
	vnFile  = "Mathewsdata."+RNAtype+".viennares"
	beamDir1= dataDir+"linearcontrafold/run_"+RNAtype+"/log.LinearContrafold."+RNAtype+".beam"
	beamDir2= dataDir+"linearvienna/run_"+RNAtype+"/log.linearvienna."+RNAtype+".beam"
	outDir  = "./rearranged_results/"

	if not os.path.exists(outDir):
		os.makedirs(outDir)
	
	seq = []
	fileIn  = open(dataDir+seqFile)
	for line in fileIn.readlines():
		seq.append(line)		# the last char in seq[i] is '\n'
	fileIn.close()

	ref = []
	fileIn  = open(dataDir+refFile)
	for line in fileIn.readlines():
		ref.append(line)		# the last char in ref[i] is '\n'
	fileIn.close()
	

	cf = []
	fileIn  = open(dataDir+cfFile)
	for line in fileIn.readlines():
		cf.append(line)		# the last char in cf[i] is '\n'
	fileIn.close()
	

	vn = []
	fileIn  = open(dataDir+vnFile)
	for line in fileIn.readlines():
		vn.append(line)		# the last char in vn[i] is '\n'
	fileIn.close()
	

	print(len(ref[3]),len(cf[3]), len(seq[3]))

	N_seq = len(seq)
	
	for i in xrange(N_seq):
		outFile = "combine_"+RNAtype+".seq"
		if i < 9:
			outFile = outFile + "0"
		outFile = outFile + "%d" % (i+1)
		print(outFile)
		f = open(outDir+outFile,"w")

		f.write(">>>>>>seq\n"+seq[i]+">>>>>>gold\n"+ref[i]+">>>>>>contrafold\n"+cf[i]+">>>>>>vienna\n"+vn[i])


		beam_list = range(1,201)
		tmp = range(300,801,100)

		beam_list[len(beam_list):len(beam_list)] = tmp
		#print(beam_list,len(beam_list))
		for beam_i in beam_list:
			beamFile1 = beamDir1
			beamFile2 = beamDir2
			if (beam_i < 100):
				beamFile1 = beamFile1 + "0"
				beamFile2 = beamFile2 + "0"
			if (beam_i < 10):
				beamFile1 = beamFile1 + "0"
				beamFile2 = beamFile2 + "0"
			beamFile1 = beamFile1 + str(beam_i)	# generate file name like 'log.LinearContrafold.16s.beam011' to read
			beamFile2 = beamFile2 + str(beam_i)	# generate file name like 'log.LinearVienna.16s.beam016' to read

			fileIn  = open(beamFile1)
			f.write(">>>>>>LinearContrafold"+beamFile1[-8:]+"\n")
			lines = fileIn.readlines()
			f.write(lines[7*i-4]+lines[7*i-3])	#information such as Viterbi score \n time, len, score, etc.
			f.write(lines[7*i-1])			# pairing structure in beam file with linear algorithm
			fileIn.close()

			fileIn  = open(beamFile2)
			f.write(">>>>>>linearvienna"+beamFile2[-8:]+"\n")
			lines = fileIn.readlines()
			f.write(lines[7*i-4]+lines[7*i-3])	#information such as Viterbi score \n time, len, score, etc.
			f.write(lines[7*i-1])			# pairing structure in beam file with linear algorithm
			fileIn.close()

		f.close()




def RunMain():
	print("start")
	LoadData()

if __name__ == "__main__":
    RunMain()
