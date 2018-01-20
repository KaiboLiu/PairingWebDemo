from flask import Flask, request, render_template   

app = Flask(__name__)


filePath = os.path.join(os.getcwd(),"/usrData")


@app.route('/')
def my_form():
    #return render_template('myform.html')
    return render_template('myform_2in1_input.html')

#print Flask.__doc__
@app.route('/hello')
def hello_world():
    return 'Hello World!'

@app.route('/', methods=['GET', 'POST'])
def inputSeq():
    if request.method == 'POST':
        text = request.form['seqInput']
        processed_text = text.upper()+' finished'
        filename = request.files['seqFile']
        newPath = os.path.join(filePath,filename)
        file.save(newPath)
        return processed_text,newPath
        #return processed_text
        
@app.route('/uploadajax', methods=['GET', 'POST'])
def uploadSeq():
    if request.method == 'POST':
        f = request.files['seqFile']
        f.save('./uploaded_file.txt')
        return 'uploaded'

if __name__ == '__main__':
    #app.logger.debug('message processed')
    app.logger.info('message processed')
    #app.run(host='0.0.0.0', port=23, debug=True)
    app.run(debug=True)