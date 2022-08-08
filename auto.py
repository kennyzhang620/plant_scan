import time
import os
from subprocess import Popen

print("Auto updating server by KTZHANG")
mtime = os.path.getmtime(os.getcwd())

print("Starting NODE server...")
p = Popen(['node',os.getcwd() + '/server.js'])
while(True):
    if (os.path.getmtime(os.getcwd()) > mtime):
        mtime = os.path.getmtime(os.getcwd())
        p.terminate()
        print("Restarting NODE server...")
        p = Popen(['node',os.getcwd() + '/server.js'])
      #  os.system('node ' + os.getcwd() + '/server.js')

        


        
    
