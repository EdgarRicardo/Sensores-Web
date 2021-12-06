import sys
import serial
import json
import threading
from flask import Flask, jsonify, request, render_template


app = Flask(__name__)
data = {
    "mensaje":"Valores por default",
    "distancia":100,
    "temperatura":0,
    "luz":0
}

def getData():
    global data
    serialPort = serial.Serial('COM3',9600)
    print("Puerto Serial Abierto")
    while True:
        try:
            d = serialPort.readline().decode('UTF-8')
            data = json.loads(d)
            data["distancia"] = round(float(data["distancia"]))
            data["temperatura"] = round(float(data["temperatura"]))
            data["luz"] = round(float(data["luz"]))
        except Exception as e:
            print("Error Sin Info")
    serialPort.close()

@app.route('/')
def output():
	return render_template('Sensores.html')

@app.route('/getData',methods=["GET"])
def dataPort():
    return jsonify(data)

if __name__ == '__main__':
    t = threading.Thread(target=getData)
    t.start()
    app.run(debug=False, port=80,use_reloader=False,host="0.0.0.0")
    sys.exit()
    