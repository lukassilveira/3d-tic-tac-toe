from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler

counter = 0

last_move = []
messages = []

player_that_played = ""
player_that_gaveup = ""


class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ("/RPC2",)

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        SimpleXMLRPCRequestHandler.end_headers(self)


with SimpleXMLRPCServer(("localhost", 8000), requestHandler=RequestHandler) as server:
    server.register_introspection_functions()

    def connect():
        global counter
        counter = counter + 1
        return f"Player {counter}"

    def game_start_status():
        global counter
        if counter >= 2:
            return "Game Started!"
        else:
            return "Waiting for other player..."

    def move(x, y, z, player_id):
        global last_move
        global player_that_played
        last_move = [x, y, z]
        player_that_played = player_id
        return last_move

    def get_last_move():
        global last_move
        return last_move

    def testRequest():
        return "sucesso"

    def turn_listener():
        global player_that_played
        return player_that_played

    def reset_game():
        global last_move
        global player_that_played
        global player_that_gaveup
        last_move = []
        player_that_played = ""
        player_that_gaveup = ""

    def giveup(player_id):
        global player_that_gaveup
        player_that_gaveup = player_id

    def giveup_listener():
        return f"{player_that_gaveup} gave up!"
    
    def send_message(message):
        print(message)
        messages.append(message)

    def get_messages():
        return messages

    server.register_function(connect, "connect")
    server.register_function(game_start_status, "game_start_status")
    server.register_function(move, "move")
    server.register_function(giveup, "giveup")
    server.register_function(giveup_listener, "giveup_listener")
    server.register_function(get_last_move, "get_last_move")
    server.register_function(turn_listener, "turn_listener")
    server.register_function(testRequest, "testRequest")
    server.register_function(reset_game, "reset_game")
    server.register_function(send_message, "send_message")
    server.register_function(get_messages, "get_messages")

    print("Servidor XML-RPC escutando na porta 8000")
    server.serve_forever()
