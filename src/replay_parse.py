import json, struct, sys, urllib2
from flask import Flask, request, Response, current_app
from functools import wraps

app = Flask(__name__)

def jsonp(func):
    """Wraps JSONified output for JSONP requests."""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            data = str(func(*args, **kwargs).data)
            content = str(callback) + '(' + data + ')'
            mimetype = 'application/javascript'
            return current_app.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)
    return decorated_function


@app.route("/")
@jsonp
def get_replay_from_url():
	replay_url = request.args.get("url")

	f = urllib2.urlopen(replay_url)
	version, meta_length = struct.unpack('ii', f.read(8))
	meta_json = f.read(meta_length)
	
	return Response(meta_json, mimetype="application/x-javascript")


if __name__ == "__main__":
	app.run(host='0.0.0.0', port=8080, debug=True)
