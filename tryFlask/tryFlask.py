#!/usr/bin/python
#coding-utf8

from flask import Flask, request, render_template, url_for  
from werkzeug.utils import secure_filename 
import os
from time import time

app = Flask(__name__,static_url_path='')

demoURL = '/liukaib/demo'
outDir = os.path.join(os.getcwd(),"usrData")


@app.route(demoURL)
def my_form():
    #return render_template('myform.html')
    return render_template('myform_2in1_input.html')

#print Flask.__doc__
@app.route('/hello')
def hello_world():
    return 'Hello World!'

@app.route(demoURL, methods=['GET', 'POST'])
def inputSeq():
    if request.method == 'POST':

        if not os.path.exists(outDir):
            os.makedirs(outDir)

        beamsize = request.form['beamSize']
        if beamsize == '': beamsize = '20'
        text = request.form['seqInput']

        if text == '': 

            if 'seqFile' not in request.files:
                return 'No input, nor selected file'
            file = request.files['seqFile']
            '''
            if file.filename == '':
                flash('No selected file')
                return "no file"
                #return redirect(request.url)
            ''' 
            filename = secure_filename(file.filename)
            dotPos = filename.rfind('.')
            if dotPos >= 0:
                filename = filename[:dotPos] + '_' + str(time()) + filename[dotPos:]
            else: 
                filename = filename + '_' + str(time())
            #filename = str(time()) + secure_filename(file.filename)
            newPath = os.path.join(outDir,filename)
            file.save(newPath)
            with open(newPath) as f:
                lines = f.readlines()
                seqName = lines[0][:-1]
                seq     = lines[1][:-1]
            return newPath + '<br>name:&nbsp&nbsp' + seqName + '<br>seq:&nbsp&nbsp&nbsp&nbsp' + seq + '<br>BeamSize:&nbsp&nbsp' + beamsize
        else: 
            lineStop = text.find('\n')
            if lineStop == -1:
                return 'wrong input, supposed to be FASTA format'
            seqName = text[:lineStop]   #.upper()+' finished'
            seq     = text[lineStop+1:]
            #return processed_text,newPath
            return 'input:<br>name:&nbsp&nbsp' + seqName + '<br>seq:&nbsp&nbsp&nbsp&nbsp' + seq + '<br>BeamSize:&nbsp&nbsp' + beamsize

        '''
        file = request.files['seqFile']
        if file.filename == '':
            text = request.form['seqInput']

            if text == '': 
                #flash('No selected file')
                return "no file, no input"
                #return redirect(request.url)  

            lineStop = text.find('\n')
            if lineStop == -1:
                return 'wrong input'
            seqName = text[:lineStop]   #.upper()+' finished'
            seq     = text[lineStop+1:]            
            return 'input:<br>name:&nbsp&nbsp' + seqName + '<br>seq:&nbsp&nbsp&nbsp&nbsp' + seq

        else:
            filename = str(time()) + secure_filename(file.filename)
            newPath = os.path.join(outDir,filename)
            file.save(newPath)
            with open(newPath) as f:
                lines = f.readlines()
                seqName = lines[0][:-1]
                seq     = lines[1][:-1]
            return newPath + '<br>name:&nbsp&nbsp' + seqName + '<br>seq:&nbsp&nbsp&nbsp&nbsp' + seq
        '''

if __name__ == '__main__':
    #app.logger.debug('message processed')
    app.logger.info('message processed')
    #app.run(host='0.0.0.0', port=8001)#, debug=True)
    app.run(debug=True)
