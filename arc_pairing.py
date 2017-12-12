#!/usr/bin/env python

'''
Developer: Kaibo(lrushx)
Email: liukaib@oregonstate.edu
Process Time: Dec 08, 2017
 */
'''

'''
# read from "combine_16s.seq0*", use line 1 as seq, line 3 as ref/gold, line 5 as cf, line 7 as vn, line(8i+3) as linearcf, line(8i+7) as linearvf (start from line 0)
# to compose 4 circle graphs, we need to compare 4 sets(cf:gold, vn:gold,Lcf:gold,Lvn:gold)
'''

'''
In the saved data file, .seq03 for example, there are 1656 lines(seq *2 + ref *2 + cf *2 + vn *2 + linearcf *206*4 + lineavnf *206*4)
The structure of the file is:
seq * 2 lines				----->  L1
ref * 2 lines				----->  L3
cf  * 2 lines				----->  L5
vn  * 2 lines 				----->  L7
linearcf.beam001 * 4 lines  ----->  L11 (with 2 lines of information above)
lineavnf.beam001 * 4 lines  ----->  L16 (with 2 lines of information above)
linearcf.beam002 * 4 lines
lineavnf.beam002 * 4 lines
linearcf.beam00i * 4 lines  ----->  L(8*i+3) (with 2 lines of information above), if i > 200, L[(i/100+198)*8+3]
lineavnf.beam00i * 4 lines  ----->  L(8*i+7) (with 2 lines of information above), if i > 200, L[(i/100+198)*8+7]
'''