import serial
import sys
import json
import threading
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

@app.route('/')
def output():
	# serve index template
	return render_template('Sensores.html')

@app.route('/getData',methods=["GET"])
def dataPort():
    data = getData()
    return data

def getData():
    serialPort = serial.Serial('COM3',9600)
    while True:
        try:
            d = serialPort.readline().decode('UTF-8')
            data = json.loads(d)
            data["distancia"] = round(float(data["distancia"]))
            data["temperatura"] = round(float(data["temperatura"]))
            data["luz"] = round(float(data["luz"]))
            return jsonify(data)
        except Exception as e:
            print("Error"+ str(e))
    serialPort.close()

if __name__ == '__main__':
    app.run(debug=True, port=4000)