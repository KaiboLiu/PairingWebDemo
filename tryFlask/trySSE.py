import time
from flask import Response, Flask, render_template

app = Flask(__name__)

@app.route('/event_stream')
def stream():
    def event_stream():
        while True:
            time.sleep(2)
            yield 'data: {},{}\n\n'.format(time.asctime(),'hola mundo')
            #yield 'data: %s\n\n' % 'hola mundo'
    return Response(event_stream(), mimetype="text/event-stream")

@app.route('/')
def index():
    return render_template('trySSE.html')

if __name__ == '__main__':
    app.run(debug=True)
