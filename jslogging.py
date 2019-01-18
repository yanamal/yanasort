import os
from google.appengine.api import users
from flask import Flask,request,render_template

from google.appengine.ext import ndb

class Log(ndb.Model):
    timestamp = ndb.DateTimeProperty(auto_now_add=True) 
    ip_address = ndb.StringProperty()
    action = ndb.StringProperty() 
    data = ndb.StringProperty()
    order = ndb.StringProperty()

# make the flask app:
app = Flask(__name__)

# Set up debug/error logging, when not running "for real" on Google App Engine:
if not os.getenv('SERVER_SOFTWARE').startswith('Google App Engine/'):
    app.debug = True  # with this setting on, the cause of Python errors is displayed in App Engine logs.


# This special "logging" handler will log whatever the JS side asks it to.
# Technically not the most tamper-proof, but only using it to log JS events.
# the reason it's in a separate handler is because all requests that go through main.py
# themselves get logged as a user action, which is unnecessary for automated "logging" requests.
@app.route('/logevent', methods=['POST'])
def logEvent():
    
    log = Log()
    log.ip_address = request.remote_addr
    log.action=request.form["action"]
    log.data=request.form["data"]
    log.order=request.form["order"]
    
    log.put()
    return "logged"
