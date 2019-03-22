import RPi.GPIO as GPIO
GPIO.cleanup() 
from pirc522 import RFID
rdr = RFID()
#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
from time import sleep
import socket
import json

server_address = '/tmp/example.sock'

sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
tries_delay = 1
tries_done = 0
stp = True

try:
  sock.connect(server_address)
  stp = False
except socket.error:
  print("Initial connec() failed")

while stp:
  print('Trying connecting in {} sec...'.format(tries_delay))
  sleep(tries_delay)
  sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
  try:
      sock.connect(server_address)
      stp = True
  except socket.error:
      tries_done += 1
      print('Could not connect for {} time(s).'.format(tries_done))

print("RFPY=>Connected to socket server")

while True:
  rdr.wait_for_tag()
  (error, tag_type) = rdr.request()
  if not error:
    print("Tag detected")
    (error, uid) = rdr.anticoll()
    if not error:
      # Select Tag is required before Auth
      if not rdr.select_tag(uid):
        # Auth for block 10 (block 2 of sector 2) using default shipping key A
        if not rdr.card_auth(rdr.auth_a, 10, [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF], uid):
          # This will print something like (False, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
          rfid_data = str(rdr.read(10))
          print("Reading block 10: " + rfid_data)
          if rfid_data:
            msg = rfid_data.encode('UTF-8')
            sock.send((str(uid) + '\n').encode('UTF-8'))
          # Always stop crypto1 when done working
          rdr.stop_crypto()
  sleep(3)
sock.close()
# Calls GPIO cleanup
rdr.cleanup()