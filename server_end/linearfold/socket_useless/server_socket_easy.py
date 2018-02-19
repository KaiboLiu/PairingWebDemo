#!/usr/bin/python
# -*- coding: UTF-8 -*-
# server_socket.py

import socket               # import socket module

s = socket.socket()         # creat socket object
host = socket.gethostname() # get local host name
port = 11113                # set port
s.bind((host, port))        # bind port

s.listen(5)                 # wait for users's connect
while True:
    c, addr = s.accept()     # built connection
    print 'client address', addr
    c.send('Hello world, it\'s Kaibo, from server: %s: %s\nYour address is: %s' %(host, port, addr))
    c.close()                # close connection