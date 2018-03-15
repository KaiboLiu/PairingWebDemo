from flask import Flask
from time import sleep
from concurrent.futures import ThreadPoolExecutor

# DOCS https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor
executor = ThreadPoolExecutor(2)

app = Flask(__name__)


@app.route('/jobs')
def run_jobs():
    thread1 = executor.submit(some_long_task1)
    yield thread1.result()
    thread2 = executor.submit(some_long_task2, 'hello', 123)
    yield thread2.result()
    return 'Two jobs was launched in background!'


def some_long_task1():
    #print("Task #1 started!")
    yield "Task #1 started, in background!"
    sleep(10)
    #print("Task #1 is done!")
    yield "Taks #1 is done, in background!"


def some_long_task2(arg1, arg2):
    print("Task #2 started with args: %s %s!" % (arg1, arg2))
    sleep(5)
    print("Task #2 is done!")


if __name__ == '__main__':
    app.run(debug=True)
