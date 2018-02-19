#!/usr/bin/python
# -*- coding: UTF-8 -*-
# file_name：client_socket.py

import socket               # import socket module

s = socket.socket()         # creat socket object
#host = 'flip3.engr.oregonstate.edu'
host = 'ironcreek.eecs.oregonstate.edu'
#host = socket.gethostname() # get local host name
port = 11113                # set port

s.connect((host, port))
#s.send('sent from client')
s.send('1518829942.65input')
print s.recv(1024)
s.close()  
