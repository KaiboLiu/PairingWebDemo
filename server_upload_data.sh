#!/bin/bash
# scp files to OSU server for web demo

scp -i ~/.ssh/OSU_server_rsa -r /Users/zhangyilin/0_pipi/LKB_OSU/Research/RNA/web_demo_canvas/demo_rearranged_results liukaib@flop.engr.oregonstate.edu:/nfs/stak/users/liukaib/public_html/demo_data/
scp -i ~/.ssh/OSU_server_rsa -r /Users/zhangyilin/0_pipi/LKB_OSU/Research/RNA/web_demo_canvas/demo_pairing_for_js liukaib@flop.engr.oregonstate.edu:/nfs/stak/users/liukaib/public_html/demo_data/
