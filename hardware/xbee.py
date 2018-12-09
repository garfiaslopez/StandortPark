import serial
import json
import requests
import threading
from time import sleep

last_status = "no_status"

def set_interval(func, sec):
	def func_wrapper():
		set_interval(func, sec)
		func()
	t = threading.Timer(sec, func_wrapper)
	t.start()
	return t


ser = serial.Serial("/dev/ttyUSB0", 9600)
print"conectado puerto serial"

url_server= "http://142.93.80.44:3500"

def check_slots():
	global last_status
	print "checking the slots"
	full_url = url_server + "/slots"
	r = requests.post(full_url, data = { 'limit': 100, 'page': 1 })
	slots = json.loads(r.content)['data']['docs']
	for slot in slots:
		if slot['_id'] == '5be290dcb42a53640e1b88a5':
			s_s = slot['status']
			a_s = 'none'				
			
			if ser.inWaiting():
				incoming = ser.readline().strip().split(".")
				a_s=incoming[1]
			print 's_s: ' + s_s + '  a_s: ' + a_s
			if (s_s == 'reserved' and a_s == 'none') or (s_s == 'reserved' and a_s == 'free') :
				data_to_send = slot['_id'] + ".reserved"
				ser.write(data_to_send.encode())
				print 'sended to arduino reserved'					

			elif (s_s == 'expired' and a_s == 'none') or (s_s == 'expired' and a_s == 'ocupied'):
				data_to_send = slot['_id'] + ".ocupied"
				ser.write(data_to_send.encode())
				print 'sended to arduino expired'			

			elif a_s == 'free':	
				full_url = url_server + "/slot/5be290dcb42a53640e1b88a5"
				r = requests.put(full_url, data = { 'status': 'free' })
				print r
				print 'sended to server free'
			
			elif a_s == 'ocupied':
				full_url = url_server + "/slot/5be290dcb42a53640e1b88a5"
				r = requests.put(full_url, data = { 'status': 'ocupied' })
				print r
				print 'sended to server ocupied'			
		
set_interval(check_slots, 5)
