import websockets
from jsonrpcserver import method, async_dispatch as dispatch

from http.server import *
import asyncio
import threading

import simulation

@method
async def run_simulation(*args):
    return simulation.run_simulation(*args)

async def main(websocket, path):
    async for message in websocket:
        response = await dispatch(message)
        if response.wanted:
            await websocket.send(str(response))

def start_http_server():
    httpd = HTTPServer(('', 6969), SimpleHTTPRequestHandler)
    thread = threading.Thread(target=httpd.serve_forever)
    thread.start()
    
    return thread;


if __name__ == "__main__":
    thread = start_http_server()
    
    try:
        asyncio.get_event_loop().run_until_complete(websockets.serve(main, '', 5000))
        asyncio.get_event_loop().run_forever()
    except:
        thread.join()
