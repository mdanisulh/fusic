from flask import Flask, request, send_file, jsonify, make_response
import os
import requests
import mutagen.mp4 as mp4
import tempfile

app = Flask(__name__)

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@app.route('/api/health-check', methods=['GET'])
def health_check():
    response = jsonify({"status": "Server is running"})
    return add_cors_headers(response)

@app.route('/api/download', methods=['POST'])
def download():
    data = request.json
    song_url = data["url"]
    if not song_url:
        response = jsonify({"error": "Invalid request"})
        return add_cors_headers(response), 400

    try:
        response = requests.get(song_url)
        response.raise_for_status()
        file = tempfile.NamedTemporaryFile()
        with open(file.name, "wb") as f:
            f.write(response.content)
        song = mp4.MP4(file)
        artists = list(map(lambda artist: artist["name"], data["artists"]))
        song["\xa9nam"] = [data["name"]]
        song["\xa9alb"] = [data["album"]["name"]]
        song["\xa9day"] = [data.get("year", "")]
        song["\xa9cmt"] = ["Fusic"]
        song["\xa9lyr"] = [data.get("lyrics", "")]
        song["\xa9ART"] = artists
        song["aART"] = artists
        song["covr"] = [requests.get(data["image"][2]).content]
        song.save(file)
        response = send_file(file.name, as_attachment=True, download_name=f"{data['name']}.m4a")
        os.remove(file.name)
        return add_cors_headers(response)
    except requests.RequestException as e:
        response = jsonify({"error": str(e)})
        return add_cors_headers(response), 500

if __name__ == '__main__':
    app.run(port=50516)